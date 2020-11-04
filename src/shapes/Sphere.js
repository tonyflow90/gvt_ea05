let createSphereShape = () => {
    let n = 10;
    let m = 10;
    let r = 0.8;

    // Positions.
    let vertices = new Float32Array(3 * (n + 1) * (m + 1));
    // Normals
    let normals = new Float32Array(3 * (n + 1) * (m + 1));
    // Index data.
    let indicesLines = new Uint16Array(2 * 2 * n * m);
    let indicesTris = new Uint16Array(3 * 2 * n * m);

    let du = 2 * Math.PI / n;
    let dv = Math.PI / m;

    // Counter for entries in index array.
    let iLines = 0;
    let iTris = 0;

    // Loop angle u.
    for (let i = 0, u = 0; i <= n; i++, u += du) {
        // Loop height v.
        for (let j = 0, v = 0; j <= m; j++, v += dv) {

            let iVertex = i * (m + 1) + j;

            let x, y, z = 0;
            x = r * Math.sin(v) * Math.cos(u) - 1;
            y = r * Math.sin(v) * Math.sin(u);
            z = r * Math.cos(v);

            // Set vertex positions.
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = z;
            vertices[iVertex * 3 + 2] = y;

            // Calc and set normals.
            var nx = Math.sin(v) * Math.cos(u);
            var ny = Math.sin(v) * Math.sin(u);
            var nz = Math.cos(v);
            normals[iVertex * 3] = nx;
            normals[iVertex * 3 + 1] = nz;
            normals[iVertex * 3 + 2] = ny;

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

export let Sphere = createSphereShape();
// export default class Sphere {
//     constructor(n = 32, m = 32, r = 0.8) {
//         this.n = n;
//         this.m = m;
//         this.r = r;
//     }

//     createShape() {
//         let n = this.n;
//         let m = this.m;
//         let r = this.r;

//         // Positions.
//         let vertices = new Float32Array(3 * (n + 1) * (m + 1));
//         // Index data.
//         let indicesLines = new Uint16Array(2 * 2 * n * m);
//         let indicesTris = new Uint16Array(3 * 2 * n * m);

//         let du = 2 * Math.PI / n;
//         let dv = Math.PI / m;

//         // Counter for entries in index array.
//         let iLines = 0;
//         let iTris = 0;

//         // Loop angle u.
//         for (let i = 0, u = 0; i <= n; i++, u += du) {
//             // Loop height v.
//             for (let j = 0, v = 0; j <= m; j++, v += dv) {

//                 let iVertex = i * (m + 1) + j;

//                 let x, y, z = 0;
//                 x = r * Math.sin(v) * Math.cos(u);
//                 z = r * Math.sin(v) * Math.sin(u);
//                 y = r * Math.cos(v);

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
