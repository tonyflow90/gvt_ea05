let createConeShape = () => {
    let n = 10;
    let m = 10;
    // Positions.
    let vertices = new Float32Array(3 * (n + 1) * (m + 1));
    // Normals
    let normals = new Float32Array(3 * (n + 1) * (m + 1));
    // Index data.
    let indicesLines = new Uint16Array(2 * 2 * n * m);
    let indicesTris = new Uint16Array(3 * 2 * n * m);

    let du = 2 * Math.PI / n;
    let dv = 1 / m;
    let r = 0.8;

    // Counter for entries in index array.
    let iLines = 0;
    let iTris = 0;

    // Loop angle u.
    for (let i = 0, u = 0; i <= n; i++, u += du) {
        // Loop height v.
        for (let j = 0, v = 0; j <= m; j++, v += dv) {

            let iVertex = i * (m + 1) + j;

            let x, y, z = 0;
            x = v * Math.cos(u) + 1;
            y = v * Math.sin(u);
            z = -v + 0.5; // v

            // Set vertex positions.
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = z;
            vertices[iVertex * 3 + 2] = y;

            // Calc and set normals.
            var nx = Math.cos(u);
            var ny = Math.sin(v);
            var nz = 0.5;
            normals[iVertex * 3] = 0;
            normals[iVertex * 3 + 1] = 1;
            normals[iVertex * 3 + 2] = 0;


            // Set index.
            // Line on beam.
            if (j > 0 && i > 0) {
                indicesLines[iLines++] = iVertex - 1;
                indicesLines[iLines++] = iVertex;
            }
            // Line on ring.
            if (j > 0 && i > 0) {
                indicesLines[iLines++] = iVertex - (m + 1);
                indicesLines[iLines++] = iVertex;
            }

            // Set index.
            // Two Triangles.
            if (j > 0 && i > 0) {
                indicesTris[iTris++] = iVertex;
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m + 1);
                //                            
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m + 1) - 1;
                indicesTris[iTris++] = iVertex - (m + 1);
            }
        }
    }
    return { vertices: vertices, normals: normals, indicesLines: indicesLines, indicesTris: indicesTris };
}

export let Cone = createConeShape();

// export default class Cone {
//     constructor(n = 10, m = 10) {
//         this.n = n;
//         this.m = m;
//     }

//     createShape() {
//         let n = this.n;
//         let m = this.m;
//         // Positions.
//         let vertices = new Float32Array(3 * (n + 1) * (m + 1));
//         // Index data.
//         let indicesLines = new Uint16Array(2 * 2 * n * m);
//         let indicesTris = new Uint16Array(3 * 2 * n * m);

//         let du = 2 * Math.PI / n;
//         let dv = 1 / m;
//         let r = 0.8;

//         // Counter for entries in index array.
//         let iLines = 0;
//         let iTris = 0;

//         // Loop angle u.
//         for (let i = 0, u = 0; i <= n; i++, u += du) {
//             // Loop height v.
//             for (let j = 0, v = 0; j <= m; j++, v += dv) {

//                 let iVertex = i * (m + 1) + j;

//                 let x, y, z = 0;
//                 x = v * Math.cos(u);
//                 z = v * Math.sin(u);
//                 y = -v + 0.5; // v

//                 // Set vertex positions.
//                 vertices[iVertex * 3] = x;
//                 vertices[iVertex * 3 + 1] = y;
//                 vertices[iVertex * 3 + 2] = z;

//                 // Set index.
//                 // Line on beam.
//                 if (j > 0 && i > 0) {
//                     indicesLines[iLines++] = iVertex - 1;
//                     indicesLines[iLines++] = iVertex;
//                 }
//                 // Line on ring.
//                 if (j > 0 && i > 0) {
//                     indicesLines[iLines++] = iVertex - (m + 1);
//                     indicesLines[iLines++] = iVertex;
//                 }

//                 // Set index.
//                 // Two Triangles.
//                 if (j > 0 && i > 0) {
//                     indicesTris[iTris++] = iVertex;
//                     indicesTris[iTris++] = iVertex - 1;
//                     indicesTris[iTris++] = iVertex - (m + 1);
//                     //                            
//                     indicesTris[iTris++] = iVertex - 1;
//                     indicesTris[iTris++] = iVertex - (m + 1) - 1;
//                     indicesTris[iTris++] = iVertex - (m + 1);
//                 }
//             }
//         }
//         return [vertices, indicesLines, indicesTris];
//     }
// }
