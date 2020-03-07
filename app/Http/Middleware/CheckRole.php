<?php

namespace App\Http\Middleware;

use Closure;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */

    public function handle($request, Closure $next, $role)
    {
        if (! $request->user()->hasRole($role)) {
            return new Response(view(‘unauthorized’)->with(‘role’, ‘MEMBER’));
        }
        //TODO creare check role per ogni tipo di ruolo
        return $next($request);
    }
}
