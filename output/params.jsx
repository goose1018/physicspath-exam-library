/* eslint-disable */
// 物理图解工坊 — 工作台参数定义 (per template)

const PARAMS_BY_ID = {
  projectile: {
    groups: [
      { title: '初始条件', params: [
        { key: 'v0', label: '初速度', sym: 'v₀', unit: 'm/s', min: 5, max: 40, step: 1, default: 15 },
        { key: 'h',  label: '抛出高度', sym: 'h',  unit: 'm',   min: 5, max: 80, step: 1, default: 20 },
      ]},
      { title: '显示选项', toggles: [
        { key: 'showVec', label: '显示速度分量', default: true },
        { key: 'showPath', label: '显示运动轨迹虚线', default: true },
      ]},
    ],
    formula: { lbl: '运动方程', text: 'x = v₀·t,   y = ½gt²' },
    crumb: '运动学 / 抛体运动',
  },
  incline: {
    groups: [
      { title: '斜面参数', params: [
        { key: 'theta', label: '倾角',   sym: 'θ', unit: '°',   min: 10, max: 60, step: 1, default: 30 },
        { key: 'mu',    label: '动摩擦系数', sym: 'μ', unit: '',     min: 0,  max: 0.6, step: 0.05, default: 0.20 },
        { key: 'm',     label: '质量',   sym: 'm', unit: 'kg',  min: 1,  max: 20, step: 1, default: 5 },
      ]},
    ],
    formula: { lbl: '加速度', text: 'a = g(sinθ − μcosθ)' },
    crumb: '力学 / 受力分析',
  },
  rod: {
    groups: [
      { title: '运动 & 磁场', params: [
        { key: 'v', label: '导体棒速度', sym: 'v', unit: 'm/s', min: 1, max: 10, step: 0.5, default: 4 },
        { key: 'B', label: '磁感应强度', sym: 'B', unit: 'T',   min: 0.1, max: 2.0, step: 0.1, default: 0.5 },
        { key: 'L', label: '导轨间距',   sym: 'L', unit: 'm',   min: 0.2, max: 1.5, step: 0.05, default: 0.8 },
        { key: 'R', label: '总电阻',     sym: 'R', unit: 'Ω',   min: 0.5, max: 10,  step: 0.5, default: 2 },
      ]},
    ],
    formula: { lbl: '感应电动势', text: 'ε = BLv,   I = ε/R' },
    crumb: '电磁学 / 电磁感应',
  },
  lens: {
    groups: [
      { title: '透镜参数', params: [
        { key: 'f', label: '焦距', sym: 'f', unit: 'cm', min: 5, max: 30, step: 1, default: 15 },
        { key: 'u', label: '物距', sym: 'u', unit: 'cm', min: 8, max: 80, step: 1, default: 30 },
      ]},
    ],
    formula: { lbl: '透镜方程', text: '1/u + 1/v = 1/f' },
    crumb: '光学 / 几何光学',
  },
  circular: {
    groups: [
      { title: '运动参数', params: [
        { key: 'r',     label: '半径',     sym: 'r', unit: 'm',     min: 0.5, max: 3, step: 0.1, default: 1.5 },
        { key: 'omega', label: '角速度',   sym: 'ω', unit: 'rad/s', min: 0.5, max: 6, step: 0.1, default: 2 },
        { key: 'm',     label: '质量',     sym: 'm', unit: 'kg',    min: 0.1, max: 5, step: 0.1, default: 1 },
      ]},
    ],
    formula: { lbl: '向心力', text: 'F = mω²r = mv²/r' },
    crumb: '运动学 / 圆周运动',
  },
  particle: {
    groups: [
      { title: '入射条件', params: [
        { key: 'v', label: '粒子速度', sym: 'v', unit: '×10⁶ m/s', min: 1, max: 8, step: 0.5, default: 3 },
        { key: 'B', label: '磁感应强度', sym: 'B', unit: 'T', min: 0.1, max: 2, step: 0.1, default: 0.5 },
      ]},
    ],
    formula: { lbl: '半径', text: 'r = mv / (qB)' },
    crumb: '电磁学 / 洛伦兹力',
  },
  wave: {
    groups: [
      { title: '波动参数', params: [
        { key: 'A',      label: '振幅',   sym: 'A', unit: 'cm', min: 0.5, max: 4, step: 0.1, default: 2 },
        { key: 'lambda', label: '波长',   sym: 'λ', unit: 'm',  min: 1, max: 4, step: 0.1, default: 2 },
        { key: 'T',      label: '周期',   sym: 'T', unit: 's',  min: 0.3, max: 2, step: 0.1, default: 0.8 },
      ]},
    ],
    formula: { lbl: '波动方程', text: 'y = A sin(kx − ωt)' },
    crumb: '振动波动 / 机械波',
  },
};

// fallback for templates that don't have full sim
function defaultParams() {
  return {
    groups: [{ title: '基础参数', params: [
      { key: 'a', label: '参数 A', sym: 'a', unit: '', min: 0, max: 10, step: 0.5, default: 5 },
      { key: 'b', label: '参数 B', sym: 'b', unit: '', min: 0, max: 10, step: 0.5, default: 3 },
    ]}],
    formula: { lbl: '公式', text: '即将上线' },
    crumb: '参数预览',
  };
}

function getParamSpec(id) {
  return PARAMS_BY_ID[id] || defaultParams();
}

function getDefaultValues(id) {
  const spec = getParamSpec(id);
  const out = {};
  spec.groups.forEach(g => {
    (g.params || []).forEach(p => out[p.key] = p.default);
    (g.toggles || []).forEach(t => out[t.key] = t.default);
  });
  return out;
}

Object.assign(window, { PARAMS_BY_ID, getParamSpec, getDefaultValues });
