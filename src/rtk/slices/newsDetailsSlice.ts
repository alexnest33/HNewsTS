import { createSlice } from '@reduxjs/toolkit';
import { hnClient } from '../../api/hnClient';
import { createAppAsyncThunk } from '../../hooks/hooks';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

type NewsDetails = {
  id: number;
  title: string;
  by: string;
  time: number;
  url?: string;
  descendants?: number;
  kids?: number[];
};

export type CommentItem = {
  id: number;
  by: string;
  time: number;
  text: string;
  kids: number[];
};

type NewsPageState = {
  item: NewsDetails | null;
  status: Status;
  error: string | null;
  rootComments: CommentItem[];
  rootStatus: Status;
  rootError: string | null;
  childrenByParent: Record<number, CommentItem[]>;
  childrenStatusByParent: Record<number, Status>;
};

const initialState: NewsPageState = {
  item: null,
  status: 'idle',
  error: null,
  rootComments: [],
  rootStatus: 'idle',
  rootError: null,

  childrenByParent: {},
  childrenStatusByParent: {},
};

export const detailsNewsById = createAppAsyncThunk<NewsDetails, number>(
  'newsPage/detailsNewsById',
  async (id, thunkApi) => {
    try {
      const response = await hnClient.get(`/item/${id}.json`);
      const data = response.data;

      if (!data) {
        return thunkApi.rejectWithValue('Новость не найдена');
      }

      const item: NewsDetails = {
        id: typeof data.id === 'number' ? data.id : id,
        title: data.title ?? '',
        by: data.by ?? '',
        time: typeof data.time === 'number' ? data.time : 0,
        url: data.url,
        descendants:
          typeof data.descendants === 'number' ? data.descendants : 0,
        kids: Array.isArray(data.kids) ? data.kids : [],
      };

      return item;
    } catch (e: any) {
      return thunkApi.rejectWithValue(e?.message ?? 'Ошибка загрузки новости');
    }
  }
);

export const fetchRootComments = createAppAsyncThunk<CommentItem[], number[]>(
  'newsPage/fetchRootComments',
  async (kids, thunkApi) => {
    try {
      if (!kids || kids.length === 0) return [];
      const ids = kids.slice(0, 50);
      const items = await Promise.all(
        ids.map(async (id) => {
          const r = await hnClient.get(`/item/${id}.json`);
          return r.data;
        })
      );

      const comments: CommentItem[] = items
        .filter(Boolean)
        .map((c: any) => ({
          id: typeof c.id === 'number' ? c.id : 0,
          by: c.by ?? 'unknown',
          time: typeof c.time === 'number' ? c.time : 0,
          text: c.text ?? '',
          kids: Array.isArray(c.kids) ? c.kids : [],
        }))
        .filter((c) => c.id && c.time);

      return comments;
    } catch (e: any) {
      return thunkApi.rejectWithValue(
        e?.message ?? 'Ошибка загрузки комментариев'
      );
    }
  }
);

export const fetchChildComments = createAppAsyncThunk<
  { parentId: number; children: CommentItem[] },
  { parentId: number; kids: number[] }
>('newsPage/fetchChildComments', async (arg, thunkApi) => {
  try {
    const { parentId, kids } = arg;

    if (!kids || kids.length === 0) {
      return { parentId, children: [] };
    }

    const items = await Promise.all(
      kids.map(async (id) => {
        const r = await hnClient.get(`/item/${id}.json`);
        return r.data;
      })
    );

    const children: CommentItem[] = items
      .filter(Boolean)
      .map((c: any) => ({
        id: typeof c.id === 'number' ? c.id : 0,
        by: c.by ?? 'unknown',
        time: typeof c.time === 'number' ? c.time : 0,
        text: c.text ?? '',
        kids: Array.isArray(c.kids) ? c.kids : [],
      }))
      .filter((c) => c.id && c.time);

    return { parentId, children };
  } catch (e: any) {
    return thunkApi.rejectWithValue(e?.message ?? 'Ошибка загрузки ответов');
  }
});

export const newsDetailsSlice = createSlice({
  name: 'newsPage',
  initialState,
  reducers: {
    clearNewsPage: (state) => {
      state.item = null;
      state.status = 'idle';
      state.error = null;

      state.rootComments = [];
      state.rootStatus = 'idle';
      state.rootError = null;

      state.childrenByParent = {};
      state.childrenStatusByParent = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(detailsNewsById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(detailsNewsById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.item = action.payload;
      })
      .addCase(detailsNewsById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(fetchRootComments.pending, (state) => {
        state.rootStatus = 'loading';
        state.rootError = null;
      })
      .addCase(fetchRootComments.fulfilled, (state, action) => {
        state.rootStatus = 'succeeded';
        state.rootComments = action.payload;
        state.childrenByParent = {};
        state.childrenStatusByParent = {};
      })
      .addCase(fetchRootComments.rejected, (state, action) => {
        state.rootStatus = 'failed';
        state.rootError = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(fetchChildComments.pending, (state, action) => {
        const parentId = action.meta.arg.parentId;
        state.childrenStatusByParent[parentId] = 'loading';
      })
      .addCase(fetchChildComments.fulfilled, (state, action) => {
        const { parentId, children } = action.payload;
        state.childrenByParent[parentId] = children;
        state.childrenStatusByParent[parentId] = 'succeeded';
      })
      .addCase(fetchChildComments.rejected, (state, action) => {
        const parentId = action.meta.arg.parentId;
        state.childrenStatusByParent[parentId] = 'failed';
      });
  },
});

export const { clearNewsPage } = newsDetailsSlice.actions;
export default newsDetailsSlice.reducer;
