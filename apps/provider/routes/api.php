<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\UserController;

Route::middleware('auth')->controller(UserController::class)->group(function () {
    Route::get('current-user', 'show')->name('current-user.show');
    Route::match(['put', 'patch'], 'current-user', 'update')->name('current-user.update');
    Route::delete('current-user', 'destroy')->name('current-user.destroy');
    Route::patch('current-user/forgot-password', 'forgot_password')->name('current-user.forgot-password');
    Route::post('current-user/terminate-all-sessions', 'terminate_all_sessions')->name('current-user.terminate-all-sessions');
});

Route::middleware('auth')->apiResource('applications', ApplicationController::class);

Route::controller(AuthController::class)->middleware('throttle:6,1')
    ->group(function () {
        Route::post('auth', 'store')->middleware('guest')->name('auth.post');
        Route::post('sign-out', 'destroy')->middleware(['auth'])->name('auth.destroy');
    });

Route::controller(ResetPasswordController::class)->middleware(['throttle:6,1', 'guest'])
    ->group(function () {
        Route::post('password/reset/send', 'send')->name('password.reset.send');
        Route::post('password/reset/{id?}/{hash?}', 'reset')->name('password.reset.reset');
    });

Route::post('email/verify/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    ->name('verify.account.email');
