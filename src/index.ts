//------------------------------------------------------------//
//                   Copyright (c) MidSpike                   //
//------------------------------------------------------------//

// PAO: Primitive | Primitive Array | Primitive Object Value
type PAO<T> = T | PAO<T>[] | { [ k: string ]: PAO<T> };

// SPL: Primitive String | Primitive List String
type SPL<T extends string> = `${T}` | `${T}[]`;

//------------------------------------------------------------//

type ValidInputPrimitives = string | number | boolean | null;

type ValidInput = PAO<ValidInputPrimitives>;

//------------------------------------------------------------//

type ValidStructurePrimitives = 'string' | 'number' | 'boolean' | 'null' | 'any';

type ValidStructure = PAO<SPL<ValidStructurePrimitives>>;

//------------------------------------------------------------//

/**
 * Determine if the given input matches the provided type structure.
 * This function should, realistically, only be used to examine JSON-like objects.
 *
 * @param input The input to examine.
 * @param structure The type structure to compare against.
 * @returns true if the input matches the structure, false if otherwise.
 *
 * @example
 * ```ts
 * console.log(
 *  isValidStructure(
 *   {
 *    a: 1,
 *    b: '2',
 *    c: [ 3, 4, [ 5, '6' ] ],
 *   },
 *   {
 *    a: 'number',
 *    b: 'string',
 *    c: [ 'number', 'number', [ 'number', 'string' ] ],
 *   }
 *  )
 * ); // true
 * ```
 */
export function isValidStructure<
    Input extends ValidInput,
    Structure extends ValidStructure,
>(
    input: Input,
    structure: Structure,
): boolean {
    if (typeof structure === 'string') {
        const [ type, is_array ] = structure.split('[]').map(
            (s) => s?.length > 0 ? s : true
        ) as [ ValidStructurePrimitives, boolean ];

        if (is_array) {
            if (!Array.isArray(input)) return false;

            return input.every(item => isValidStructure(item, type));
        }

        if (type === 'any') return true;

        if (type === 'null') return input === null;

        return typeof input === type;
    }

    if (typeof structure === 'object') {
        if (structure === null) return input === null;

        if (Array.isArray(structure)) {
            if (!Array.isArray(input)) return false;

            for (const [ index, nested_structure ] of structure.entries()) {
                const is_valid = isValidStructure(input[index], nested_structure);

                if (!is_valid) return false;
            }

            return true;
        }

        if (
            typeof input !== 'object' ||
            Array.isArray(input) ||
            input === null
        ) return false;

        for (const structure_key of Object.keys(structure)) {
            const is_valid = isValidStructure(input[structure_key], structure[structure_key]);

            if (!is_valid) return false;
        }

        return true;
    }

    return false;
}

async function main() {
    console.log(
        isValidStructure(
            {
                a: 1,
                b: '2',
                c: [ 3, '4', 5 ],
                d: {
                    e: 6,
                    f: '7',
                    g: [ 8, 9, 10 ],
                },
                h: true,
                i: null,
                j: [ 0, '1', null, false ],
            },
            {
                a: 'number',
                b: 'string',
                c: 'any[]',
                d: {
                    e: 'number',
                    f: 'string',
                    g: 'number[]',
                },
                h: 'boolean',
                i: 'null',
                j: [ 'number', 'string', 'null', 'boolean' ],
            }
        )
    );
}

main();
