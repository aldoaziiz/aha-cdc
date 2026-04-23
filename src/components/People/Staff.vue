<template>
    <div class="staff-content">
        <!-- Page Header -->
        <div class="page-header mb-6">
            <div>
                <h1 class="text-h4 font-weight-bold mb-2">{{ pageTitle }}</h1>
                <p class="text-body2 text-grey">{{ pageSubtitle }}</p>
            </div>
        </div>

        <!-- Data Table -->
        <v-row>
            <v-col cols="12">
                <v-card elevation="1">
                    <v-card flat>
                        <template v-slot:text>
                            <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify"
                                variant="outlined" hide-details single-line></v-text-field>
                        </template>
                        <v-data-table :headers="headers" :items="desserts" :search="search"></v-data-table>
                    </v-card>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts" setup>
const pageTitle = 'Staff'
const pageSubtitle = 'Manage and view information about staff'

const getTimeAgo = (i: number) => {
    const hours = i * 2
    return `${hours} hours ago`
}

import { ref } from 'vue'
const search = ref('')
const headers: any = [
    {
        align: 'start',
        key: 'name',
        sortable: false,
        title: 'Name',
    },
    { key: 'birthdate', title: 'Birth Date' },
    { key: 'gender', title: 'Gender' },
    { key: 'program', title: 'Program' },
    { key: 'enrollmentdate', title: 'Enrollment Date' },
    { key: 'status', title: 'Status' },
    { key: 'action', title: 'Action' },
]
const desserts = [
    {
        name: 'Frozen Yogurt',
        birthdate: '2020-01-01',
        gender: 'Male',
        program: 'KINDER',
        enrollmentdate: '2020-01-01',
        status: 'Active',
        calories: 159,
        fat: 6,
        carbs: 24,
        protein: 4,
        iron: 1,
    },
    {
        name: 'Ice cream sandwich',
        birthdate: '2020-01-02',
        gender: 'Female',
        program: 'KINDER',
        enrollmentdate: '2020-01-02',
        status: 'Inactive',
        calories: 237,
        fat: 9,
        carbs: 37,
        protein: 4.3,
        iron: 1,
    },
    {
        name: 'Eclair',
        birthdate: '2020-01-03',
        gender: 'Male',
        program: 'TODDLER',
        enrollmentdate: '2020-01-03',
        status: 'Active',
        calories: 262,
        fat: 16,
        carbs: 23,
        protein: 6,
        iron: 7,
    },
    {
        name: 'Cupcake',
        birthdate: '2020-01-04',
        gender: 'Female',
        program: 'KINDER',
        enrollmentdate: '2020-01-04',
        status: 'Active',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        iron: 8,
    },
    {
        name: 'Gingerbread',
        birthdate: '2020-01-05',
        gender: 'Male',
        program: 'KINDER',
        enrollmentdate: '2020-01-05',
        status: 'Inactive',
        calories: 356,
        fat: 16,
        carbs: 49,
        protein: 3.9,
        iron: 16,
    },
    {
        name: 'Jelly bean',
        birthdate: '2020-01-06',
        gender: 'Female',
        program: 'TODDLER',
        enrollmentdate: '2020-01-06',
        status: 'Active',
        calories: 375,
        fat: 0,
        carbs: 94,
        protein: 0,
        iron: 0,
    },
    {
        name: 'Lollipop',
        birthdate: '2020-01-07',
        gender: 'Male',
        program: 'KINDER',
        enrollmentdate: '2020-01-07',
        status: 'Active',
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        iron: 2,
    },
    {
        name: 'Honeycomb',
        birthdate: '2020-01-08',
        gender: 'Female',
        program: 'KINDER',
        enrollmentdate: '2020-01-08',
        status: 'Inactive',
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        iron: 45,
    },
    {
        name: 'Donut',
        birthdate: '2020-01-09',
        gender: 'Male',
        program: 'TODDLER',
        enrollmentdate: '2020-01-09',
        status: 'Active',
        calories: 452,
        fat: 25,
        carbs: 51,
        protein: 4.9,
        iron: 22,
    },
    {
        name: 'KitKat',
        birthdate: '2020-01-10',
        gender: 'Female',
        program: 'KINDER',
        enrollmentdate: '2020-01-10',
        status: 'Active',
        calories: 518,
        fat: 26,
        carbs: 65,
        protein: 7,
        iron: 6,
    },
]
</script>

<style scoped>
.staff-content {
    width: 100%;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.staff-content {
    width: 100%;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.stat-card {
    background: white;
    border-left: 4px solid var(--v-primary-base);
    transition: all 0.3s ease;
}

.stat-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 8px;
    background: #f5f5f5;
}

.activity-item {
    border-bottom: 1px solid #e0e0e0;
}

.activity-item:last-child {
    border-bottom: none;
}

.border-bottom {
    border-bottom: 1px solid #e0e0e0;
}

@media (max-width: 600px) {
    .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .stat-card {
        margin-bottom: 12px;
    }
}
</style>
