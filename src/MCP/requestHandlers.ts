import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { getCityWeather, getSpecificWeatherForCity } from './../tools/weather';
import { server } from './mcpServer';
import {
    weatherForCitySchema,
    specificWeatherForCitySchema,
} from '../Schemas/argSchema';

export function setRequestHandlerForListToolSchema() {
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: [getCityWeather(), getSpecificWeatherForCity()],
        };
    });
}

export function setRequestHandlerForCallToolSchema() {
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        try {
            if (request.params.name === 'get_city_weather') {
                const args = weatherForCitySchema.parse(
                    request.params.arguments
                );
                const city = args.city;

                const response = await fetch(
                    `http://localhost:3000/weather/${city}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch weather data for city: ${city}`
                    );
                }

                const weatherJson = await response.json();

                return {
                    content: [
                        {
                            type: 'text',
                            text: `The weather in ${weatherJson.city} city is: 
                        Rain Chances: ${weatherJson.rain_chance}%,
                        Precipitation: ${weatherJson.precipitation}mm,
                        Wind Speed: ${weatherJson.wind_speed}km/h,
                        Humidity: ${weatherJson.humidity}%,
                        UV Index: ${weatherJson.uvi}, 
                    `,
                        },
                    ],
                };
            } else if (
                request.params.name === 'get_specific_weather_for_city'
            ) {
                const args = specificWeatherForCitySchema.parse(
                    request.params.arguments
                );
                const city = args.city;
                const weatherField = args.weather_field;

                const response = await fetch(
                    `http://localhost:3000/weather/${city}/${weatherField}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch weather data for city: ${city}`
                    );
                }

                const specificWeatherJson = await response.json();

                if (!(weatherField in specificWeatherJson)) {
                    throw new Error(
                        `Weather field ${weatherField} not found for city: ${city}`
                    );
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: `The ${weatherField} in ${specificWeatherJson.city} is: ${specificWeatherJson[weatherField]}`,
                        },
                    ],
                };
            }

            return {
                isError: true,
                content: [
                    {
                        type: 'text',
                        text: `No tool found with name: ${request.params.name}`,
                    },
                ],
            };
        } catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: 'text',
                        text: `Error processing request: ${
                            error instanceof Error
                                ? error.message
                                : 'Unknown error'
                        }`,
                    },
                ],
            };
        }
    });
}
