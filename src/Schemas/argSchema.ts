import z from 'zod';

export const weatherForCitySchema = z.object({
    city: z.string().describe('The name of the city to get weather for'),
});

export const specificWeatherForCitySchema = z.object({
    city: z.string().describe('The name of the city to get weather for'),
    weather_field: z
        .enum(['uvi', 'wind_speed', 'humidity', 'rain_chance', 'precipitation'])
        .describe('The specific weather field to retrieve for the city'),
});
