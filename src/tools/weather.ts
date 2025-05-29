export const getCityWeather = () => {
    return {
        name: 'get_city_weather',
        title: 'Get City Weather',
        description: 'Get the weather for specific given city',
        inputSchema: {
            type: 'object',
            properties: {
                city: {
                    type: 'string',
                    description: 'The name of the city to get the weather for',
                },
            },
            required: ['city'],
        },
    };
};

export const getSpecificWeatherForCity = () => {
    return {
        name: 'get_specific_weather_for_city',
        title: 'Get Specific Weather for City',
        description: 'Get specific weather field for a city',
        inputSchema: {
            type: 'object',
            properties: {
                city: {
                    type: 'string',
                    description: 'The name of the to get the weather for',
                },
                weather_field: {
                    type: 'string',
                    description:
                        'The specific weather filed to retrieve for the city',
                },
            },
            required: ['city', 'weather_field'],
        },
    };
};
