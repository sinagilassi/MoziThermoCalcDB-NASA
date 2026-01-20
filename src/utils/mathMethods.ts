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
