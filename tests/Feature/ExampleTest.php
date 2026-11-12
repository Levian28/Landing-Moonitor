<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_landing_page_renders_without_a_database(): void
    {
        $this->withoutVite();
        config([
            'database.default' => 'mysql',
            'session.driver' => 'file',
            'cache.default' => 'file',
        ]);

        $this->get('/')
            ->assertOk()
            ->assertSee('Cerdas Pantau Sapi')
            ->assertSee('Fitur Utama')
            ->assertSee('Tentang MOONITOR')
            ->assertSee('Pantau Semua dari Satu Tempat')
            ->assertSee('Teknologi di Balik MOONITOR')
            ->assertSee('Pertanyaan Umum');

        $this->assertFileExists(public_path('images/cow-barn.jpg'));
        $this->assertFileExists(public_path('images/dashobard-dummy.png'));
    }
}
