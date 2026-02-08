import { promises as fs } from 'node:fs';
import { parse } from 'csv-parse/sync';
// NOTE: import from mozithermocalcdb-nasa
import { ComponentKey, NASARangeType, StateType } from 'mozithermocalcdb-nasa';
import { CompoundTemperatureRanges, ModelSource } from 'mozithermocalcdb-nasa';
import type { NASA9TemperatureRangeData } from 'mozithermocalcdb-nasa';
import { setComponentId } from 'mozithermocalcdb-nasa';
import { Component } from 'mozithermocalcdb-nasa';

type RawCSVRow = Record<string, string>;
export type RangeFile = { path: string; range: NASARangeType };

function toNumber(value: string | number | undefined): number | null {
    const num = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(num) ? num : null;
}

// NOTE: Build Component from NASA9TemperatureRangeData
function buildComponent(data: NASA9TemperatureRangeData): Component {
    return {
        name: data.Name,
        formula: data.Formula,
        state: data.State as StateType
    };
}

// SECTION: DataLoader Class for loading NASA polynomial data from CSV files
export class DataLoader {
    constructor(private readonly rangeFiles: RangeFile[]) {
        if (!rangeFiles.length) {
            throw new Error('DataLoader requires at least one CSV path; data must be supplied externally.');
        }
    }

    async loadModelSource(): Promise<ModelSource> {
        const modelSource: ModelSource = {};

        for (const { path: filePath, range } of this.rangeFiles) {
            const rows = await this.parseCSV(filePath);
            for (const row of rows) {
                const transformed = this.transformRow(row, range);
                if (!transformed) continue;

                const keys = this.generateKeys(transformed);
                for (const key of keys) {
                    if (!modelSource[key]) {
                        modelSource[key] = {} as CompoundTemperatureRanges;
                    }
                    modelSource[key][range] = transformed;
                }
            }
        }

        return modelSource;
    }

    private async parseCSV(filePath: string): Promise<RawCSVRow[]> {
        const file = await fs.readFile(filePath, 'utf-8');
        return parse(file, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        }) as RawCSVRow[];
    }

    private transformRow(row: RawCSVRow, range: NASARangeType): NASA9TemperatureRangeData | null {
        const phase_flag = toNumber(row.phase_flag) ?? 0;
        const MW = toNumber(row.mw);
        const EnFo_IG = toNumber(row.hf298);
        const Tmin = toNumber(row.T_low);
        const Tmax = toNumber(row.T_high);
        const dEnFo_IG_298 = toNumber(row.dh298_0);
        const a1 = toNumber(row.a1);
        const a2 = toNumber(row.a2);
        const a3 = toNumber(row.a3);
        const a4 = toNumber(row.a4);
        const a5 = toNumber(row.a5);
        const a6 = toNumber(row.a6);
        const a7 = toNumber(row.a7);
        const b1 = toNumber(row.b1);
        const b2 = toNumber(row.b2);

        if (
            !row.name ||
            !row.formula ||
            !row.state ||
            MW === null ||
            EnFo_IG === null ||
            Tmin === null ||
            Tmax === null ||
            a1 === null ||
            a2 === null ||
            a3 === null ||
            a4 === null ||
            a5 === null ||
            a6 === null ||
            a7 === null ||
            b1 === null ||
            b2 === null
        ) {
            return null;
        }

        return {
            Name: row.name.trim(),
            Formula: row.formula.trim(),
            State: row.state.trim(),
            formula_raw: row.formula_raw ?? '',
            phase_flag,
            MW,
            EnFo_IG,
            Tmin,
            Tmax,
            dEnFo_IG_298: dEnFo_IG_298 ?? 0,
            a1,
            a2,
            a3,
            a4,
            a5,
            a6,
            a7,
            b1,
            b2,
            [range]: 1
        };
    }

    private generateKeys(data: NASA9TemperatureRangeData): string[] {
        const component = buildComponent(data);
        const keys: ComponentKey[] = ['Name-State', 'Formula-State', 'Name-Formula', 'Name-Formula-State', 'Formula-Name-State'];
        return keys.map((componentKey) => setComponentId({ component, componentKey }));
    }
}

export async function loadModelSource(rangeFiles: RangeFile[]): Promise<ModelSource> {
    const loader = new DataLoader(rangeFiles);
    return loader.loadModelSource();
}
