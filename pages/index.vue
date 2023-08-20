<template>
  <main class="bg-[#596052] p-5 h-screen">
    <h2 class="text-white text-center text-[48px]">Taiwan Weather Map</h2>
    <div class="grid grid-cols-3">
      <div class="col-span-2 flex justify-center">
        <TaiwanSVG @hover="onHover" />

      </div>
      <div class="col-span-1 flex flex-col p-6 gap-5">
        <h3 class="text-white text-3xl">天氣預報</h3>
        <p class="text-white text-2xl">縣市: {{details.city || '-'}}</p>
        <p class="text-white text-2xl">時段: {{time}}</p>
        <p class="text-white text-2xl">舒適度: {{details.ci.parameter?.parameterName || '-'}}</p>
        <p class="text-white text-2xl">天氣: {{details.wx.parameter?.parameterName || '-'}}</p>
        <p class="text-white text-2xl">降雨機率: {{ pop }}</p>
        <p class="text-white text-2xl">溫度範圍: {{temp}}</p>
      </div>
    </div>

  </main>
</template>
<script setup>
onMounted(async () => {
  await nextTick();
  fetchWeather();
});

const weatherData = ref(null);
const details = reactive({
  city: null,
  wx: {},
  ci: {},
  pop: {},
  maxT: {},
  minT: {},
});

const time = computed(() => {
  if (details.wx.startTime && details.wx.endTime) {
    return `${details.wx.startTime} - ${details.wx.endTime}`;
  }
  return "-";
});

const pop = computed(() => {
  return details.pop.parameter
    ? `${details.pop.parameter.parameterName}%`
    : "-";
});

const temp = computed(() => {
  if (details.minT.parameter && details.maxT.parameter) {
    return `${details.minT.parameter.parameterName} ~ ${details.maxT.parameter.parameterName} °C`;
  }
  return "-";
});

const onHover = (cityName) => {
  getWeatherAndCity(cityName);
};

const getWeatherAndCity = (cityName) => {
  if(!weatherData.value) return 
  const { locationName, weatherElement } = weatherData.value.find(
    (item) => item.locationName === cityName
  );
  details.city = locationName;
  const wx = weatherElement.find((item) => item.elementName === "Wx");
  const ci = weatherElement.find((item) => item.elementName === "CI");
  const pop = weatherElement.find((item) => item.elementName === "PoP");
  const minT = weatherElement.find((item) => item.elementName === "MinT");
  const maxT = weatherElement.find((item) => item.elementName === "MaxT");
  details.wx = wx.time.find((item) => checkTime(item.startTime, item.endTime));
  details.ci = ci.time.find((item) => checkTime(item.startTime, item.endTime));
  details.pop = pop.time.find((item) =>
    checkTime(item.startTime, item.endTime)
  );
  details.minT = minT.time.find((item) =>
    checkTime(item.startTime, item.endTime)
  );
  details.maxT = maxT.time.find((item) =>
    checkTime(item.startTime, item.endTime)
  );
};

const checkTime = (start, end) => {
  const today = new Date();
  return today >= new Date(start) && today < new Date(end);
};
const config = useRuntimeConfig();
const fetchWeather = async () => {
  try {
    const { data } = await useFetch(
      `${config.public.baseURL}/v1/rest/datastore/F-C0032-001?Authorization=${config.apiKey}`
    );
    weatherData.value = data.value.records.location;
  } catch (error) {
    console.log(error);
  }
};
</script>
