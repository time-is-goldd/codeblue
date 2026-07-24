/**
 * 임시 placeholder GLB 생성 스크립트 (일회성 개발 도구, 프로덕션 코드 아님).
 * 실제 브랜드 로고 GLB로 교체되기 전까지 Three.js 파이프라인(로딩/렌더링/에러 처리)을
 * 실제로 검증하기 위한 최소 유효 glTF 2.0 바이너리(.glb)를 手동으로 구성한다.
 * 사각뿔(정사면체) 4면에 대해 flat shading normal을 계산해 얹은 단순 메시 하나뿐이다.
 */
const fs = require("fs");
const path = require("path");

const v0 = [0, 1, 0];
const v1 = [0.943, -0.333, 0];
const v2 = [-0.471, -0.333, 0.816];
const v3 = [-0.471, -0.333, -0.816];

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const normalize = (v) => {
  const len = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / len, v[1] / len, v[2] / len];
};
const centroid = (...pts) => [
  pts.reduce((s, p) => s + p[0], 0) / pts.length,
  pts.reduce((s, p) => s + p[1], 0) / pts.length,
  pts.reduce((s, p) => s + p[2], 0) / pts.length,
];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const center = centroid(v0, v1, v2, v3);

function orderFace(a, b, c) {
  const n = cross(sub(b, a), sub(c, a));
  const faceCenter = centroid(a, b, c);
  const outward = sub(faceCenter, center);
  return dot(n, outward) < 0 ? [a, c, b] : [a, b, c];
}

function faceNormal(a, b, c) {
  return normalize(cross(sub(b, a), sub(c, a)));
}

const rawFaces = [
  [v0, v1, v2],
  [v0, v2, v3],
  [v0, v3, v1],
  [v1, v3, v2],
];

const positions = [];
const normals = [];

for (const [a, b, c] of rawFaces) {
  const [oa, ob, oc] = orderFace(a, b, c);
  const n = faceNormal(oa, ob, oc);
  positions.push(...oa, ...ob, ...oc);
  normals.push(...n, ...n, ...n);
}

const vertCount = positions.length / 3;

const posBuffer = Buffer.alloc(positions.length * 4);
positions.forEach((v, i) => posBuffer.writeFloatLE(v, i * 4));

const normBuffer = Buffer.alloc(normals.length * 4);
normals.forEach((v, i) => normBuffer.writeFloatLE(v, i * 4));

const binBuffer = Buffer.concat([posBuffer, normBuffer]);

const xs = [];
const ys = [];
const zs = [];
for (let i = 0; i < positions.length; i += 3) {
  xs.push(positions[i]);
  ys.push(positions[i + 1]);
  zs.push(positions[i + 2]);
}
const min = [Math.min(...xs), Math.min(...ys), Math.min(...zs)];
const max = [Math.max(...xs), Math.max(...ys), Math.max(...zs)];

const gltf = {
  asset: { version: "2.0", generator: "codeblue-placeholder-generator" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: "LogoPlaceholder" }],
  meshes: [
    {
      name: "LogoPlaceholderMesh",
      primitives: [
        {
          attributes: { POSITION: 0, NORMAL: 1 },
          material: 0,
          mode: 4,
        },
      ],
    },
  ],
  materials: [
    {
      name: "AccentMaterial",
      pbrMetallicRoughness: {
        baseColorFactor: [0.1843, 0.4353, 0.9294, 1.0],
        metallicFactor: 0.35,
        roughnessFactor: 0.35,
      },
    },
  ],
  accessors: [
    {
      bufferView: 0,
      byteOffset: 0,
      componentType: 5126,
      count: vertCount,
      type: "VEC3",
      min,
      max,
    },
    {
      bufferView: 1,
      byteOffset: 0,
      componentType: 5126,
      count: vertCount,
      type: "VEC3",
    },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: posBuffer.length, target: 34962 },
    { buffer: 0, byteOffset: posBuffer.length, byteLength: normBuffer.length, target: 34962 },
  ],
  buffers: [{ byteLength: binBuffer.length }],
};

const jsonStr = JSON.stringify(gltf);
let jsonBuf = Buffer.from(jsonStr, "utf8");
const jsonPad = (4 - (jsonBuf.length % 4)) % 4;
if (jsonPad > 0) jsonBuf = Buffer.concat([jsonBuf, Buffer.alloc(jsonPad, 0x20)]);

let binBuf = binBuffer;
const binPad = (4 - (binBuf.length % 4)) % 4;
if (binPad > 0) binBuf = Buffer.concat([binBuf, Buffer.alloc(binPad, 0x00)]);

const jsonChunkHeader = Buffer.alloc(8);
jsonChunkHeader.writeUInt32LE(jsonBuf.length, 0);
jsonChunkHeader.writeUInt32LE(0x4e4f534a, 4); // 'JSON'

const binChunkHeader = Buffer.alloc(8);
binChunkHeader.writeUInt32LE(binBuf.length, 0);
binChunkHeader.writeUInt32LE(0x004e4942, 4); // 'BIN\0'

const totalLength = 12 + jsonChunkHeader.length + jsonBuf.length + binChunkHeader.length + binBuf.length;

const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0); // magic 'glTF'
header.writeUInt32LE(2, 4); // version
header.writeUInt32LE(totalLength, 8);

const glb = Buffer.concat([header, jsonChunkHeader, jsonBuf, binChunkHeader, binBuf]);

const outPath = path.join(__dirname, "..", "public", "models", "logo.glb");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, glb);
console.log(`GLB written: ${outPath} (${glb.length} bytes)`);
