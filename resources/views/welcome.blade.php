@extends('layouts.landing')

@section('content')
    @include('components.landing.hero')
    <div class="moon-container">
        @include('components.landing.promo')
        @include('components.landing.features')
        @include('components.landing.about')
        @include('components.landing.dashboard')
        @include('components.landing.technology')
        @include('components.landing.testimonials')
        @include('components.landing.faq')
    </div>
    @include('components.landing.cta')
@endsection
