<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create the single admin user if not exists
        User::firstOrCreate(
            ['email' => 'admin@short.url'],
            [
                'name' => 'Admin',
                'password' => 'password',
            ]
        );
    }
}
