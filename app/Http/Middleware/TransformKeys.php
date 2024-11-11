<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TransformKeys
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $input = $request->all();
        $transformed = $this->transformKeys($input);

        $request->replace($transformed);

        return $next($request);
    }

    /**
     * Recursively transform array keys to snake_case.
     *
     * @param  array  $input
     * @return array
     */
    protected function transformKeys(array $input)
    {
        $transformed = [];

        foreach ($input as $key => $value) {
            $newKey = Str::snake($key);

            is_array($value) ? 
            $transformed[$newKey] = $this->transformKeys($value) 
            : $transformed[$newKey] = $value;
        }

        return $transformed;
    }
}
