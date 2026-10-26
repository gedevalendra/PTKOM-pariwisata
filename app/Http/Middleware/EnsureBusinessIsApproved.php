<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBusinessIsApproved
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->role === 'business_owner' && $user->validation_status !== 'approved') {
            abort(403, 'Akun mitra Anda belum disetujui oleh Administrator.');
        }

        return $next($request);
    }
}
