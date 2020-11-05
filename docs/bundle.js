(function () {
  'use strict';

  /**
   * Common utilities
   * @module glMatrix
   */
  // Configuration Constants
  var EPSILON = 0.000001;
  var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
  if (!Math.hypot) Math.hypot = function () {
    var y = 0,
        i = arguments.length;

    while (i--) {
      y += arguments[i] * arguments[i];
    }

    return Math.sqrt(y);
  };

  /**
   * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
   * @module mat4
   */

  /**
   * Creates a new identity mat4
   *
   * @returns {mat4} a new 4x4 matrix
   */

  function create() {
    var out = new ARRAY_TYPE(16);

    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
    }

    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }
  /**
   * Copy the values from one mat4 to another
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the source matrix
   * @returns {mat4} out
   */

  function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  /**
   * Set a mat4 to the identity matrix
   *
   * @param {mat4} out the receiving matrix
   * @returns {mat4} out
   */

  function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {number} left Left bound of the frustum
   * @param {number} right Right bound of the frustum
   * @param {number} bottom Bottom bound of the frustum
   * @param {number} top Top bound of the frustum
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @returns {mat4} out
   */

  function ortho(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis.
   * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {ReadonlyVec3} eye Position of the viewer
   * @param {ReadonlyVec3} center Point the viewer is looking at
   * @param {ReadonlyVec3} up vec3 pointing up
   * @returns {mat4} out
   */

  function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    var eyex = eye[0];
    var eyey = eye[1];
    var eyez = eye[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var centerx = center[0];
    var centery = center[1];
    var centerz = center[2];

    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);

    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.hypot(y0, y1, y2);

    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }

  let VertexShader = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;

    uniform mat4 uPMatrix;
    uniform mat4 uMVMatrix;

    varying vec4 vColor;

    void main(){
        gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);

        vColor = vec4(aNormal.x, aNormal.y, aNormal.z, 1.0);
        vColor = (vColor + 1.0) / 2.0;
    }
`;

  let FragmentShader = `
    precision mediump float;
    varying vec4 vColor;

    void main() {
        gl_FragColor = vColor;
    }
`;

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
              normals[iVertex * 3] = nx;
              normals[iVertex * 3 + 1] = ny;
              normals[iVertex * 3 + 2] = nz;


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
  };

  let Cone = createConeShape();

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
  };

  let Sphere = createSphereShape();
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

  let App = (function () {

      let gl;

      // The shader program object is also used to
      // store attribute and uniform locations.
      let prog;

      // Array of model objects.
      let models = [];

      let camera = {
          // Initial position of the camera.
          eye: [0, 1, 4],
          // Point to look at.
          center: [0, 0, 0],
          // Roll and pitch of the camera.
          up: [0, 1, 0],
          // Opening angle given in radian.
          // radian = degree*2*PI/360.
          fovy: 60.0 * Math.PI / 180,
          // Camera near plane dimensions:
          // value for left right top bottom in projection.
          lrtb: 2.0,
          // View matrix.
          vMatrix: create(),
          // Projection matrix.
          pMatrix: create(),
          // Projection types: ortho, perspective, frustum.
          projectionType: "ortho",
          // Angle to Z-Axis for camera when orbiting the center
          // given in radian.
          zAngle: 0,
          // Angle to Z-Axis for camera when orbiting the center
          // given in radian.
          yAngle: 0,
          // Distance in XZ-Plane from center when orbiting.
          distance: 4,
      };

      function start() {
          init();
          render();
      }

      function init() {
          initWebGL();
          initShaderProgram();
          initUniforms();
          initModels();
          initEventHandler();
          initPipline();
      }

      function initWebGL() {
          // Get canvas and WebGL context.
          // canvas = document.getElementById('canvas1');
          let canvas = document.querySelector('#canvas1');
          gl = canvas.getContext('webgl');
          gl.viewportWidth = canvas.width;
          gl.viewportHeight = canvas.height;
      }

      /**
       * Init pipeline parameters that will not change again.
       * If projection or viewport change, their setup must
       * be in render function.
       */
      function initPipline() {
          gl.clearColor(.95, .95, .95, 1);

          // Backface culling.
          gl.frontFace(gl.CCW);
          gl.enable(gl.CULL_FACE);
          gl.cullFace(gl.BACK);

          // Depth(Z)-Buffer.
          gl.enable(gl.DEPTH_TEST);

          // Polygon offset of rastered Fragments.
          gl.enable(gl.POLYGON_OFFSET_FILL);
          gl.polygonOffset(0.5, 0);

          // Set viewport.
          gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

          // Init camera.
          // Set projection aspect ratio.
          camera.aspect = gl.viewportWidth / gl.viewportHeight;
      }

      function initShaderProgram() {
          // Init vertex shader.
          let vs = initShader(gl.VERTEX_SHADER, VertexShader);
          // Init fragment shader.
          let fs = initShader(gl.FRAGMENT_SHADER, FragmentShader);
          // Link shader into a shader program.
          prog = gl.createProgram();
          gl.attachShader(prog, vs);
          gl.attachShader(prog, fs);
          gl.bindAttribLocation(prog, 0, "aPosition");
          gl.linkProgram(prog);
          gl.useProgram(prog);
      }

      /**
       * Create and init shader from source.
       * 
       * @parameter shaderType: openGL shader type.
       * @parameter SourceTagId: Id of HTML Tag with shader source.
       * @returns shader object.
       */
      function initShader(shaderType, shaderSource) {
          let shader = gl.createShader(shaderType);
          // let shaderSource = document.getElementById(SourceTagId).text;
          gl.shaderSource(shader, shaderSource);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
              console.log(SourceTagId + ": " + gl.getShaderInfoLog(shader));
              return null;
          }
          return shader;
      }

      function initUniforms() {
          // Projection Matrix.
          prog.pMatrixUniform = gl.getUniformLocation(prog, "uPMatrix");

          // Model-View-Matrix.
          prog.mvMatrixUniform = gl.getUniformLocation(prog, "uMVMatrix");
      }

      function initModels() {
          // fill-style
          let fs = "fillwireframe";
          // createModel(Torus, fs);
          createModel(Cone, fs);
          createModel(Sphere, fs);
      }

      /**
       * Create model object, fill it and push it in models array.
       * 
       * @parameter geometryname: string with name of geometry.
       * @parameter fillstyle: wireframe, fill, fillwireframe.
       */
      function createModel(geometry, fillstyle) {
          let model = {};
          model.fillstyle = fillstyle;
          initDataAndBuffers(model, geometry);
          // Create and initialize Model-View-Matrix.
          model.mvMatrix = create();

          models.push(model);
      }

      /**
       * Init data and buffers for model object.
       * 
       * @parameter model: a model object to augment with data.
       * @parameter geometryname: string with name of geometry.
       */
      function initDataAndBuffers(model, geometry) {
          // Provide model object with vertex data arrays.
          // Fill data arrays for Vertex-Positions, Normals, Index data:
          // vertices, normals, indicesLines, indicesTris;
          // Pointer this refers to the window.
          // this[geometryname]['createVertexData'].apply(model);
          Object.assign(model, geometry);

          // Setup position vertex buffer object.
          model.vboPos = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
          gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW);
          // Bind vertex buffer to attribute variable.
          prog.positionAttrib = gl.getAttribLocation(prog, 'aPosition');
          gl.enableVertexAttribArray(prog.positionAttrib);

          // Setup normal vertex buffer object.
          model.vboNormal = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
          gl.bufferData(gl.ARRAY_BUFFER, model.normals, gl.STATIC_DRAW);
          // Bind buffer to attribute variable.
          prog.normalAttrib = gl.getAttribLocation(prog, 'aNormal');
          gl.enableVertexAttribArray(prog.normalAttrib);

          // Setup lines index buffer object.
          model.iboLines = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesLines,
              gl.STATIC_DRAW);
          model.iboLines.numberOfElements = model.indicesLines.length;
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

          // Setup triangle index buffer object.
          model.iboTris = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesTris,
              gl.STATIC_DRAW);
          model.iboTris.numberOfElements = model.indicesTris.length;
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      }

      function initEventHandler() {

          var deltaRotate = Math.PI / 36;


          window.onkeydown = function (evt) {
              let key = evt.which ? evt.which : evt.keyCode;
              let c = String.fromCharCode(key);

              // Change projection of scene.
              switch (c) {
                  case ('W'):
                      // Orbit camera.
                      camera.yAngle -= deltaRotate;
                      break;
                  case ('A'):
                      // Orbit camera.
                      camera.zAngle += deltaRotate;
                      break;
                  case ('S'):
                      // Orbit camera.
                      camera.yAngle += deltaRotate;
                      break;
                  case ('D'):
                      // Orbit camera.
                      camera.zAngle -= deltaRotate;
                      break;
              }

              // Render the scene again on any key pressed.
              render();
          };
      }

      function calculateCameraOrbit() {
          // Calculate x,z position/eye of camera orbiting the center.
          var x = 0, y = 1, z = 2;

          camera.eye[x] = camera.center[x];
          camera.eye[y] = camera.center[y];
          camera.eye[z] = camera.center[z];
          camera.eye[x] += camera.distance * Math.sin(camera.zAngle);
          camera.eye[y] += camera.distance * Math.sin(camera.yAngle);
          camera.eye[z] += camera.distance * Math.cos(camera.zAngle);
      }

      /**
       * Run the rendering pipeline.
       */
      function render() {
          // Clear framebuffer and depth-/z-buffer.
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

          setProjection();

          identity(camera.vMatrix);

          calculateCameraOrbit();

          // Set view matrix depending on camera.
          lookAt(camera.vMatrix, camera.eye, camera.center, camera.up);

          // Loop over models.
          for (let i = 0; i < models.length; i++) {
              // Update modelview for model.
              copy(models[i].mvMatrix, camera.vMatrix);

              // Set uniforms for model.
              gl.uniformMatrix4fv(prog.mvMatrixUniform, false,
                  models[i].mvMatrix);

              draw(models[i]);
          }
      }

      function setProjection() {
          // Set projection Matrix.
          switch (camera.projectionType) {
              case ("ortho"):
                  let v = camera.lrtb;
                  ortho(camera.pMatrix, -v, v, -v, v, -10, 10);
                  break;
          }
          // Set projection uniform.
          gl.uniformMatrix4fv(prog.pMatrixUniform, false, camera.pMatrix);
      }

      function draw(model) {
          // Setup position VBO.
          gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
          gl.vertexAttribPointer(prog.positionAttrib, 3, gl.FLOAT, false, 0, 0);

          // Setup normal VBO.
          gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
          gl.vertexAttribPointer(prog.normalAttrib, 3, gl.FLOAT, false, 0, 0);

          // Setup rendering tris.
          let fill = (model.fillstyle.search(/fill/) != -1);
          if (fill) {
              gl.enableVertexAttribArray(prog.normalAttrib);
              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
              gl.drawElements(gl.TRIANGLES, model.iboTris.numberOfElements,
                  gl.UNSIGNED_SHORT, 0);
          }

          // Setup rendering lines.
          let wireframe = (model.fillstyle.search(/wireframe/) != -1);
          if (wireframe) {
              gl.disableVertexAttribArray(prog.normalAttrib);
              gl.vertexAttrib3f(prog.normalAttrib, 0, 0, 0);
              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
              gl.drawElements(gl.LINES, model.iboLines.numberOfElements,
                  gl.UNSIGNED_SHORT, 0);
          }
      }

      // App interface.
      return {
          start: start
      }

  }());

  let RecursiveSphere = (function () {

      let index = 0;
      let vertices = [];
      let normals = [];
      let indicesLines = [];
      let indicesTris = [];

      let normalize = (x, y, z) => {
          length = Math.sqrt(x * x + y * y + z * z);
          x = x / length;
          y = y / length;
          z = z / length;
          return { x: x, y: y, z: z };
      };

      let addVertice = (x, y, z) => {
          vertices = [...vertices, x, z, y];
      };

      let addNormal = (x, y, z) => {
          let length = Math.sqrt(x * x + y * y + z * z);
          x = x / length;
          y = y / length;
          z = z / length;
          normals = [...normals, x, z, y];
      };

      let addIndicesLine = (n) => {
          indicesLines = [...indicesLines, n];
      };

      let addIndicesTris = (n) => {
          indicesTris = [...indicesTris, n];
      };

      let createTessellateTriangle = (v1, v2, v3, recursionLevel) => {
          if (recursionLevel > 1) {
              let s1 = { x: 0, y: 0, z: 0 }, s2 = { x: 0, y: 0, z: 0 }, s3 = { x: 0, y: 0, z: 0 };
              // Seitenhalbierende ermitteln
              s1.x = (v2.x + v3.x) / 2;
              s1.y = (v2.y + v3.y) / 2;
              s1.z = (v2.z + v3.z) / 2;
              s2.x = (v1.x + v3.x) / 2;
              s2.y = (v1.y + v3.y) / 2;
              s2.z = (v1.z + v3.z) / 2;
              s3.x = (v1.x + v2.x) / 2;
              s3.y = (v1.y + v2.y) / 2;
              s3.z = (v1.z + v2.z) / 2;

              // auf Kugeloberfläche projezieren
              // addNormal(s1.x, s1.y, s1.z);
              // addNormal(s2.x, s2.y, s2.z);
              // addNormal(s3.x, s3.y, s3.z);

              s1 = normalize(s1.x, s1.y, s1.z);
              s2 = normalize(s2.x, s2.y, s2.z);
              s3 = normalize(s3.x, s3.y, s3.z);

              // rekursiv weiter tessellieren
              createTessellateTriangle(s1, s2, s3, recursionLevel - 1);
              createTessellateTriangle(v1, s3, s2, recursionLevel - 1);
              createTessellateTriangle(s3, v2, s1, recursionLevel - 1);
              createTessellateTriangle(s2, s1, v3, recursionLevel - 1);
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
      };



      let createShape = (recursionLevel = 1) => {

          index = 0;
          vertices = [];
          normals = [];
          indicesLines = [];
          indicesTris = [];

          let w = 1 / Math.sqrt(3);
          let v1 = { x: w, y: w, z: w },
              v3 = { x: w, y: -1 * w, z: -1 * w },
              v6 = { x: -1 * w, y: w, z: -1 * w },
              v8 = { x: -1 * w, y: -1 * w, z: w };

          createTessellateTriangle(v1, v3, v8, recursionLevel);
          createTessellateTriangle(v1, v3, v6, recursionLevel);
          createTessellateTriangle(v1, v6, v8, recursionLevel);
          createTessellateTriangle(v3, v6, v8, recursionLevel);

          return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indicesLines: new Uint16Array(indicesLines), indicesTris: new Uint16Array(indicesTris) };
      };

      // App interface.
      return {
          createShape: createShape
      }

  }());

  let App$1 = (function () {

      let gl;

      // The shader program object is also used to
      // store attribute and uniform locations.
      let prog;

      // Array of model objects.
      let models = [];

      let camera = {
          // Initial position of the camera.
          eye: [0, 1, 4],
          // Point to look at.
          center: [0, 0, 0],
          // Roll and pitch of the camera.
          up: [0, 1, 0],
          // Opening angle given in radian.
          // radian = degree*2*PI/360.
          fovy: 60.0 * Math.PI / 180,
          // Camera near plane dimensions:
          // value for left right top bottom in projection.
          lrtb: 2.0,
          // View matrix.
          vMatrix: create(),
          // Projection matrix.
          pMatrix: create(),
          // Projection types: ortho, perspective, frustum.
          projectionType: "ortho",
          // Angle to Z-Axis for camera when orbiting the center
          // given in radian.
          zAngle: 0,
          // Angle to Z-Axis for camera when orbiting the center
          // given in radian.
          yAngle: 0,
          // Distance in XZ-Plane from center when orbiting.
          distance: 4,
      };

      function start() {
          init();
          render();
      }

      function init() {
          initWebGL();
          initShaderProgram();
          initUniforms();
          initModels();
          initEventHandler();
          initPipline();
      }

      function initWebGL() {
          // Get canvas and WebGL context.
          // canvas = document.getElementById('canvas1');
          let canvas = document.querySelector('#canvas2');
          gl = canvas.getContext('webgl');
          gl.viewportWidth = canvas.width;
          gl.viewportHeight = canvas.height;
      }

      /**
       * Init pipeline parameters that will not change again.
       * If projection or viewport change, their setup must
       * be in render function.
       */
      function initPipline() {
          gl.clearColor(.95, .95, .95, 1);

          // Backface culling.
          gl.frontFace(gl.CCW);
          gl.enable(gl.CULL_FACE);
          gl.cullFace(gl.BACK);

          // Depth(Z)-Buffer.
          gl.enable(gl.DEPTH_TEST);

          // Polygon offset of rastered Fragments.
          gl.enable(gl.POLYGON_OFFSET_FILL);
          gl.polygonOffset(0.5, 0);

          // Set viewport.
          gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

          // Init camera.
          // Set projection aspect ratio.
          camera.aspect = gl.viewportWidth / gl.viewportHeight;
      }

      function initShaderProgram() {
          // Init vertex shader.
          let vs = initShader(gl.VERTEX_SHADER, VertexShader);
          // Init fragment shader.
          let fs = initShader(gl.FRAGMENT_SHADER, FragmentShader);
          // Link shader into a shader program.
          prog = gl.createProgram();
          gl.attachShader(prog, vs);
          gl.attachShader(prog, fs);
          gl.bindAttribLocation(prog, 0, "aPosition");
          gl.linkProgram(prog);
          gl.useProgram(prog);
      }

      /**
       * Create and init shader from source.
       * 
       * @parameter shaderType: openGL shader type.
       * @parameter SourceTagId: Id of HTML Tag with shader source.
       * @returns shader object.
       */
      function initShader(shaderType, shaderSource) {
          let shader = gl.createShader(shaderType);
          // let shaderSource = document.getElementById(SourceTagId).text;
          gl.shaderSource(shader, shaderSource);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
              console.log(SourceTagId + ": " + gl.getShaderInfoLog(shader));
              return null;
          }
          return shader;
      }

      function initUniforms() {
          // Projection Matrix.
          prog.pMatrixUniform = gl.getUniformLocation(prog, "uPMatrix");

          // Model-View-Matrix.
          prog.mvMatrixUniform = gl.getUniformLocation(prog, "uMVMatrix");
      }

      function initModels() {
          // fill-style
          let fs = "fillwireframe";
          createModel(RecursiveSphere.createShape(1), fs);
      }

      /**
       * Create model object, fill it and push it in models array.
       * 
       * @parameter geometryname: string with name of geometry.
       * @parameter fillstyle: wireframe, fill, fillwireframe.
       */
      function createModel(geometry, fillstyle) {
          let model = {};
          model.fillstyle = fillstyle;
          initDataAndBuffers(model, geometry);
          // Create and initialize Model-View-Matrix.
          model.mvMatrix = create();

          models.push(model);
      }

      /**
       * Init data and buffers for model object.
       * 
       * @parameter model: a model object to augment with data.
       * @parameter geometryname: string with name of geometry.
       */
      function initDataAndBuffers(model, geometry) {
          // Provide model object with vertex data arrays.
          // Fill data arrays for Vertex-Positions, Normals, Index data:
          // vertices, normals, indicesLines, indicesTris;
          // Pointer this refers to the window.
          // this[geometryname]['createVertexData'].apply(model);
          Object.assign(model, geometry);

          // Setup position vertex buffer object.
          model.vboPos = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
          gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW);
          // Bind vertex buffer to attribute variable.
          prog.positionAttrib = gl.getAttribLocation(prog, 'aPosition');
          gl.enableVertexAttribArray(prog.positionAttrib);

          // Setup normal vertex buffer object.
          model.vboNormal = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
          gl.bufferData(gl.ARRAY_BUFFER, model.normals, gl.STATIC_DRAW);
          // Bind buffer to attribute variable.
          prog.normalAttrib = gl.getAttribLocation(prog, 'aNormal');
          gl.enableVertexAttribArray(prog.normalAttrib);

          // Setup lines index buffer object.
          model.iboLines = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesLines,
              gl.STATIC_DRAW);
          model.iboLines.numberOfElements = model.indicesLines.length;
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

          // Setup triangle index buffer object.
          model.iboTris = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesTris,
              gl.STATIC_DRAW);
          model.iboTris.numberOfElements = model.indicesTris.length;
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      }

      function initEventHandler() {

          let slider = document.querySelector('#tessellationSlider');

          slider.onchange = (evt) => {
              let tesNumber = parseInt(evt.target.value);

              models = [];
              // fill-style
              let fs = "fillwireframe";
              createModel(RecursiveSphere.createShape(tesNumber), fs);

              // Render the scene again on any key pressed.
              render();
          };
      }

      function calculateCameraOrbit() {
          // Calculate x,z position/eye of camera orbiting the center.
          var x = 0, y = 1, z = 2;

          camera.eye[x] = camera.center[x];
          camera.eye[y] = camera.center[y];
          camera.eye[z] = camera.center[z];
          camera.eye[x] += camera.distance * Math.sin(camera.zAngle);
          camera.eye[y] += camera.distance * Math.sin(camera.yAngle);
          camera.eye[z] += camera.distance * Math.cos(camera.zAngle);
      }

      /**
       * Run the rendering pipeline.
       */
      function render() {
          // Clear framebuffer and depth-/z-buffer.
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

          setProjection();

          identity(camera.vMatrix);

          calculateCameraOrbit();

          // Set view matrix depending on camera.
          lookAt(camera.vMatrix, camera.eye, camera.center, camera.up);

          // Loop over models.
          for (let i = 0; i < models.length; i++) {
              // Update modelview for model.
              copy(models[i].mvMatrix, camera.vMatrix);

              // Set uniforms for model.
              gl.uniformMatrix4fv(prog.mvMatrixUniform, false,
                  models[i].mvMatrix);

              draw(models[i]);
          }
      }

      function setProjection() {
          // Set projection Matrix.
          switch (camera.projectionType) {
              case ("ortho"):
                  let v = camera.lrtb;
                  ortho(camera.pMatrix, -v, v, -v, v, -10, 10);
                  break;
          }
          // Set projection uniform.
          gl.uniformMatrix4fv(prog.pMatrixUniform, false, camera.pMatrix);
      }

      function draw(model) {
          // Setup position VBO.
          gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
          gl.vertexAttribPointer(prog.positionAttrib, 3, gl.FLOAT, false, 0, 0);

          // Setup normal VBO.
          gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
          gl.vertexAttribPointer(prog.normalAttrib, 3, gl.FLOAT, false, 0, 0);

          // Setup rendering tris.
          let fill = (model.fillstyle.search(/fill/) != -1);
          if (fill) {
              gl.enableVertexAttribArray(prog.normalAttrib);
              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
              gl.drawElements(gl.TRIANGLES, model.iboTris.numberOfElements,
                  gl.UNSIGNED_SHORT, 0);
          }

          // Setup rendering lines.
          let wireframe = (model.fillstyle.search(/wireframe/) != -1);
          if (wireframe) {
              gl.disableVertexAttribArray(prog.normalAttrib);
              gl.vertexAttrib3f(prog.normalAttrib, 1, 0, 0);
              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
              gl.drawElements(gl.LINES, model.iboLines.numberOfElements,
                  gl.UNSIGNED_SHORT, 0);
          }
      }

      // App interface.
      return {
          start: start
      }

  }());

  document.body.onload = () => {
      App.start();
      App$1.start();
  };

}());
//# sourceMappingURL=bundle.js.map
