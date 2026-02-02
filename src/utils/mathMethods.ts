// import libs


// SECTION: Trapezoidal Rule for Numerical Integration
export function integrateTrapezoidal(
    f: (x: number) => number,
    a: number,
    b: number,
    n = 200
): number {
    const h = (b - a) / n;
    let sum = 0;

    for (let i = 0; i <= n; i++) {
        const x = a + i * h;
        const w = (i === 0 || i === n) ? 0.5 : 1;
        sum += w * f(x);
    }

    return sum * h;
}

// SECTION: Bisection Root Finder
export function bisectRoot(
    f: (x: number) => number,
    a: number,
    b: number,
    tolerance = 1e-4,
    maxIterations = 100
): { value: number; iterations: number } | null {
    if (a === b) return null;

    let fa = f(a);
    let fb = f(b);

    if (!Number.isFinite(fa) || !Number.isFinite(fb)) return null;
    if (fa === 0) return { value: a, iterations: 0 };
    if (fb === 0) return { value: b, iterations: 0 };
    if (fa * fb > 0) return null;

    let left = a;
    let right = b;
    let mid = (left + right) / 2;

    for (let i = 1; i <= maxIterations; i++) {
        mid = (left + right) / 2;
        const fm = f(mid);
        if (!Number.isFinite(fm)) return null;

        if (fm === 0 || Math.abs(right - left) <= tolerance) {
            return { value: mid, iterations: i };
        }

        if (fa * fm < 0) {
            right = mid;
            fb = fm;
        } else {
            left = mid;
            fa = fm;
        }
    }

    return { value: mid, iterations: maxIterations };
}
