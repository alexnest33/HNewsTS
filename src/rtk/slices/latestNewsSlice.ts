import { createSlice } from '@reduxjs/toolkit';
import { hnClient } from '../../api/hnClient';
import { createAppAsyncThunk } from '../../hooks/hooks';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';
type NewsItem = {
  id: number;
  title: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  url?: string;
};
type LatestNewsState = {
  items: NewsItem[];
  status: Status;
  error: string | null;
  lastUpdated: number | null;
};

const initialState: LatestNewsState = {
  items: [],
  status: 'idle',
  error: null,
  lastUpdated: null,
};

export const latestNews = createAppAsyncThunk<
  NewsItem[],
  { feed?: 'top' | 'new' | 'best' | 'ask' | 'show' | 'jobs' } | void
>('latestNews/fetchLatestNews', async (arg, thunkApi) => {
  try {
    const feed = arg?.feed ?? 'top';

    const endpoint =
      feed === 'top'
        ? '/topstories.json'
        : feed === 'new'
          ? '/newstories.json'
          : feed === 'best'
            ? '/beststories.json'
            : feed === 'ask'
              ? '/askstories.json'
              : feed === 'show'
                ? '/showstories.json'
                : '/jobstories.json';
    const { data: ids } = await hnClient.get<number[]>(endpoint);

    const first100 = ids.slice(0, 100);

    const items = await Promise.all(
      first100.map((id) => hnClient.get(`/item/${id}.json`).then((r) => r.data))
    );

    const news: NewsItem[] = items
      .filter(Boolean)
      .map((x: any) => ({
        id: x.id,
        title: x.title ?? '',
        score: typeof x.score === 'number' ? x.score : 0,
        by: x.by ?? '',
        time: typeof x.time === 'number' ? x.time : 0,
        descendants: typeof x.descendants === 'number' ? x.descendants : 0,
        url: x.url,
      }))
      .filter((x) => x.id && x.title && x.by && x.time)
      .sort((a, b) => b.time - a.time);

    return news;
  } catch (e: any) {
    return thunkApi.rejectWithValue(e?.message ?? 'Ошибка загрузки новостей');
  }
});

export const latestNewsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(latestNews.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(latestNews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(latestNews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  },
});

export default latestNewsSlice.reducer;
