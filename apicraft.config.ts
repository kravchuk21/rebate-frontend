import { apicraft } from '@siberiacancode/apicraft';

export default apicraft([
  {
    input: './swagger.json',
    output: './src/shared/api/generated',
    instance: 'fetches',
    nameBy: 'path',
    groupBy: 'tags',
    plugins: ['tanstack'],
  },
]);