let RecursiveSphere = (function () {

    let index = 0;
    let vertices = [];
    let normals = [];
    let indicesLines = [];
    let indicesTris = [];

    let normalize = (x, y, z) => {
        length = Math.sqrt(x * x + y * y + z * z)
        x = x / length
        y = y / length
        z = z / length
        return { x: x, y: y, z: z };
    }

    let addVertice = (x, y, z) => {
        vertices = [...vertices, x, z, y];
    }

    let addNormal = (x, y, z) => {
        let length = Math.sqrt(x * x + y * y + z * z)
        x = x / length;
        y = y / length;
        z = z / length;
        normals = [...normals, x, z, y];
    }

    let addIndicesLine = (n) => {
        indicesLines = [...indicesLines, n];
    }

    let addIndicesTris = (n) => {
        indicesTris = [...indicesTris, n];
    }

    let createTetraeder = () => {
        let index = 0;
        let w = 1 / Math.sqrt(3)
        let v1 = { x: w, y: w, z: w },
            v2 = { x: w, y: w, z: -1 * w },
            v3 = { x: w, y: -1 * w, z: -1 * w },
            v4 = { x: w, y: -1 * w, z: w },
            v5 = { x: -1 * w, y: w, z: w },
            v6 = { x: -1 * w, y: w, z: -1 * w },
            v7 = { x: -1 * w, y: -1 * w, z: -1 * w },
            v8 = { x: -1 * w, y: -1 * w, z: w };
    
        // vertices triangle 1
        addVertice(v1.x, v1.y, v1.z);
        addVertice(v3.x, v3.y, v3.z);
        addVertice(v8.x, v8.y, v8.z);
    
        // line indices triangle 1
        addIndicesLine(index);
        addIndicesLine(index + 1);
        addIndicesLine(index + 1);
        addIndicesLine(index + 2);
        addIndicesLine(index + 2);
        addIndicesLine(index);
    
        // tris indices triangle 1
        addIndicesTris(index);
        addIndicesTris(index + 1);
        addIndicesTris(index + 2);
        addIndicesTris(index + 2);
        addIndicesTris(index + 1);
        addIndicesTris(index);
    
        index += 3;
    
        // vertices triangle 2
        addVertice(v1.x, v1.y, v1.z);
        addVertice(v3.x, v3.y, v3.z);
        addVertice(v6.x, v6.y, v6.z);
    
        // line indices triangle 2
        addIndicesLine(index);
        addIndicesLine(index + 1);
        addIndicesLine(index + 1);
        addIndicesLine(index + 2);
        addIndicesLine(index + 2);
        addIndicesLine(index);
    
        // tris indices triangle 2
        addIndicesTris(index);
        addIndicesTris(index + 1);
        addIndicesTris(index + 2);
        addIndicesTris(index + 2);
        addIndicesTris(index + 1);
        addIndicesTris(index);
    
        index += 3;
    
        // vertices triangle 3
        addVertice(v1.x, v1.y, v1.z);
        addVertice(v6.x, v6.y, v6.z);
        addVertice(v8.x, v8.y, v8.z);
    
        // line indices triangle 3
        addIndicesLine(index);
        addIndicesLine(index + 1);
        addIndicesLine(index + 1);
        addIndicesLine(index + 2);
        addIndicesLine(index + 2);
        addIndicesLine(index);
    
        // tris indices triangle 3
        addIndicesTris(index);
        addIndicesTris(index + 1);
        addIndicesTris(index + 2);
        addIndicesTris(index + 2);
        addIndicesTris(index + 1);
        addIndicesTris(index);
    
        index += 3;
    
        // vertices triangle 4
        addVertice(v3.x, v3.y, v3.z);
        addVertice(v6.x, v6.y, v6.z);
        addVertice(v8.x, v8.y, v8.z);
    
        // line indices triangle 4
        addIndicesLine(index);
        addIndicesLine(index + 1);
        addIndicesLine(index + 1);
        addIndicesLine(index + 2);
        addIndicesLine(index + 2);
        addIndicesLine(index);
    
        // tris indices triangle 4
        addIndicesTris(index);
        addIndicesTris(index + 1);
        addIndicesTris(index + 2);
        addIndicesTris(index + 2);
        addIndicesTris(index + 1);
        addIndicesTris(index);
    }

    let createTessellateTriangle = (v1, v2, v3, recursionLevel) => {
        if (recursionLevel > 1) {
            let s1 = { x: 0, y: 0, z: 0 }, s2 = { x: 0, y: 0, z: 0 }, s3 = { x: 0, y: 0, z: 0 };
            // Seitenhalbierende ermitteln
            s1.x = (v2.x + v3.x) / 2
            s1.y = (v2.y + v3.y) / 2
            s1.z = (v2.z + v3.z) / 2
            s2.x = (v1.x + v3.x) / 2
            s2.y = (v1.y + v3.y) / 2
            s2.z = (v1.z + v3.z) / 2
            s3.x = (v1.x + v2.x) / 2
            s3.y = (v1.y + v2.y) / 2
            s3.z = (v1.z + v2.z) / 2

            // auf Kugeloberfläche projezieren
            // addNormal(s1.x, s1.y, s1.z);
            // addNormal(s2.x, s2.y, s2.z);
            // addNormal(s3.x, s3.y, s3.z);

            s1 = normalize(s1.x, s1.y, s1.z);
            s2 = normalize(s2.x, s2.y, s2.z);
            s3 = normalize(s3.x, s3.y, s3.z);

            // rekursiv weiter tessellieren
            createTessellateTriangle(s1, s2, s3, recursionLevel - 1)
            createTessellateTriangle(v1, s3, s2, recursionLevel - 1)
            createTessellateTriangle(s3, v2, s1, recursionLevel - 1)
            createTessellateTriangle(s2, s1, v3, recursionLevel - 1)
        } else {
            // addNormal(s1.x, s1.y, s1.z);
            addNormal(v1.x, v1.y, v1.z);
            addNormal(v2.x, v2.y, v2.z);
            addNormal(v3.x, v3.y, v3.z);

            addVertice(v1.x, v1.y, v1.z);
            addVertice(v2.x, v2.y, v2.z);
            addVertice(v3.x, v3.y, v3.z);

            // line indices triangle 1
            addIndicesLine(index);
            addIndicesLine(index + 1);
            addIndicesLine(index + 1);
            addIndicesLine(index + 2);
            addIndicesLine(index + 2);
            addIndicesLine(index);

            // tris indices triangle 1
            addIndicesTris(index);
            addIndicesTris(index + 1);
            addIndicesTris(index + 2);

            addIndicesTris(index + 2);
            addIndicesTris(index + 1);
            addIndicesTris(index);

            index += 3;
        }
    }



    let createShape = (recursionLevel = 1) => {

        index = 0;
        vertices = [];
        normals = [];
        indicesLines = [];
        indicesTris = [];

        let w = 1 / Math.sqrt(3)
        let v1 = { x: w, y: w, z: w },
            v2 = { x: w, y: w, z: -1 * w },
            v3 = { x: w, y: -1 * w, z: -1 * w },
            v4 = { x: w, y: -1 * w, z: w },
            v5 = { x: -1 * w, y: w, z: w },
            v6 = { x: -1 * w, y: w, z: -1 * w },
            v7 = { x: -1 * w, y: -1 * w, z: -1 * w },
            v8 = { x: -1 * w, y: -1 * w, z: w };

        createTessellateTriangle(v1, v3, v8, recursionLevel);
        createTessellateTriangle(v1, v3, v6, recursionLevel);
        createTessellateTriangle(v1, v6, v8, recursionLevel);
        createTessellateTriangle(v3, v6, v8, recursionLevel);

        return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indicesLines: new Uint16Array(indicesLines), indicesTris: new Uint16Array(indicesTris) };
    }

    // App interface.
    return {
        createShape: createShape
    }

}());

export default RecursiveSphere;