<script setup lang="ts">
import { ref, watch } from 'vue';
import { useFlightStore } from '../stores/flight';

function getMostFrequentCountry(flights: Flight[]): string | null {
    const countryCount: { [key: string]: number } = {};

    flights.forEach(flight => {
        const country = flight.origin_country;
        if (country in countryCount) {
            countryCount[country]++;
        } else {
            countryCount[country] = 1;
        }
    });

    let mostFrequentCountry: string | null = null;
    let maxCount = 0;

    for (const country in countryCount) {
        if (countryCount[country] > maxCount) {
            mostFrequentCountry = country;
            maxCount = countryCount[country];
        }
    }

    return mostFrequentCountry;
}
const store = useFlightStore()

watch(() => store.flight, () => mostFrequentCountry.value = getMostFrequentCountry(store.flight) || '')

const mostFrequentCountry = ref('')
</script>

<template>
    <div class="top-div">

        <p>Origine de vol la plus fréquente: {{ mostFrequentCountry }}</p>

    </div>
</template>

<style scoped lang="scss">
.top-div {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    text-transform: uppercase;
    text-decoration: underline;
}
</style>