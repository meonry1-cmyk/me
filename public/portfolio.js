const fourColors = ["khaki", "white", "black", "gray"];
const detailLabels = { white: "白色", black: "黑色", gray: "灰色", khaki: "卡其色", all: "" };

const projects = [
  {
    key: "single", title: "单人位沙发", type: "三色系列 · 场景与详情",
    labels: ["卡其色主图", "黑色主图", "灰色主图"],
    images: ["single-3", "single-1", "single-2"], coverSource: "/assets/single-cover.jpg", details: ["khaki", "black", "gray"]
  },
  {
    key: "u", title: "U 型沙发", type: "四色系列 · 场景、主图与详情",
    labels: ["白色场景", "黑色场景", "灰色场景", "卡其色场景", "黑色系列 · 使用场景", "黑色系列 · 面料特写", "黑色系列 · 模块组合"],
    images: ["u-0", "u-1", "u-2", "u-3", "black-0", "black-3", "black-8"], coverSource: "/assets/u-khaki-cover.jpg", details: fourColors
  },
  { key: "l", title: "L 型沙发", type: "四色系列 · 场景与详情", coverSource: "/assets/l-khaki-cover.jpg", labels: ["白色场景", "黑色场景", "灰色场景", "卡其色场景"], details: fourColors },
  { key: "f03", title: "F03 左右版本", type: "项目素材 · 四色方案", coverSource: "/assets/f03-khaki-cover.jpg", labels: ["白色", "黑色", "灰色", "卡其色"], details: fourColors },
  { key: "suite", title: "儿童模块沙发", type: "商品主图与详情", coverSource: "/assets/suite-cover.jpg", labels: ["组合主图", "另一种组合"], details: ["all"] },
  { key: "main", title: "智能坐便器", type: "商品主图与功能展示", coverSource: "/assets/main-cover.jpg", labels: ["商品主图"], details: ["all"] },
  { key: "gold", title: "金色淋浴房", type: "场景与产品细节", coverSource: "/assets/gold-1.jpg", labels: ["正面场景", "侧面场景"], details: ["all"] },
];

const childBed = {
  key: "zcool-wood",
  title: "实木板式渲染",
  type: "儿童床与收纳家具",
  coverSource: "/assets/zcool-wood-2.jpg",
  labels: [
    "拱形收纳架", "收纳组合正面", "收纳组合全景", "屋形儿童床",
    "儿童床与收纳架", "儿童低床正面", "儿童低床与活动区", "儿童低床侧面",
    "带收纳的高架床", "开放式高架床", "高架床储物布局", "屋形组合床侧面",
    "屋形滑梯床", "高架床正面", "儿童组合床", "儿童滑梯床",
  ],
  mainSheets: ["all"],
};
const archiveProjects = [
  childBed,
  { key: "zcool-panel", title: "板式", type: "餐边柜、餐桌与收纳系列", coverSource: "/assets/zcool-panel-15.jpg", mainSheets: ["all"] },
  { key: "zcool-sofa", title: "沙发渲染", type: "沙发场景与功能展示", mainSheets: ["all"] },
];

const development = { title: "沙发产品开发记录", type: "结构、面料与场景探索", labels: ["开发过程截图"], source: "/assets/development.png" };
const f03l = {
  key: "f03l", title: "F03L 沙发", type: "四色系列 · 主图与详情",
  labels: ["白色场景", "卡其色场景", "灰色场景", "黑色场景", "灯芯绒细节", "产品细节", "产品规格"], mainSheets: fourColors, details: fourColors
};
const f03Footrest = {
  key: "f03-foot", title: "F03 脚踏", type: "四色系列 · 主图与详情",
  labels: ["卡其色场景", "白色场景", "灰色场景", "黑色场景", "模块布局", "沙发与脚踏组合"], mainSheets: fourColors, details: fourColors
};
const dialog = document.querySelector("#gallery");
const title = document.querySelector("#gallery-title");
const caption = document.querySelector("#gallery-caption");
const image = document.querySelector("#gallery-image");
const imageFrame = document.querySelector("#gallery-image-frame");
const download = document.querySelector("#download-detail");
const modes = document.querySelector("#gallery-modes");
const modeButtons = [...modes.querySelectorAll("button")];
const variant = document.querySelector("#gallery-variant");
const variants = variant.closest("label");
const position = document.querySelector("#gallery-position");
const thumbnails = document.querySelector("#thumbnails");
const controls = document.querySelector(".gallery-controls");
let selectedProject;
let selectedImages;
let selectedIndex;

function imageSource(project, index) {
  const filename = project.images?.[index] ?? project.key + "-" + index;
  return project.source ?? "/assets/" + filename + ".jpg";
}

function openGallery(project) {
  selectedProject = project;
  const sheets = [
    ["main", "主图长图", project.mainSheets ?? (project.details ? ["all"] : [])],
    ["detail", "详情长图", project.details ?? []],
  ];
  selectedImages = sheets.flatMap(([mode, name, colors]) => colors.map((color) => ({
    label: detailLabels[color] + name,
    color,
    src: "/assets/" + project.key + "-" + mode + "-" + color + ".jpg",
    mode,
  })));
  const hasLongImages = selectedImages.length > 0;
  if (!hasLongImages) {
    selectedImages = project.labels.map((label, index) => ({ label, src: imageSource(project, index), mode: "photo" }));
  }
  for (const button of modeButtons) {
    button.hidden = !selectedImages.some((entry) => entry.mode === button.dataset.mode);
  }
  modes.hidden = modeButtons.filter((button) => !button.hidden).length < 2;
  title.textContent = project.title;
  caption.textContent = project.type;
  thumbnails.hidden = hasLongImages || selectedImages.length < 2;
  controls.hidden = thumbnails.hidden;
  thumbnails.replaceChildren(...(thumbnails.hidden ? [] : selectedImages.map((entry, index) => {
    const thumbnail = document.createElement("button");
    thumbnail.type = "button";
    thumbnail.setAttribute("aria-label", entry.label);
    const preview = document.createElement("img");
    preview.src = entry.src;
    preview.alt = "";
    preview.loading = "lazy";
    thumbnail.append(preview);
    thumbnail.addEventListener("click", () => showImage(index));
    return thumbnail;
  })));
  showImage(0);
  dialog.showModal();
  dialog.scrollTop = 0;
}

function showImage(index) {
  const count = selectedImages.length;
  selectedIndex = (index + count) % count;
  const entry = selectedImages[selectedIndex];
  const isLong = entry.mode !== "photo";
  dialog.toggleAttribute("data-long", isLong);
  imageFrame.toggleAttribute("data-long", isLong);
  imageFrame.setAttribute("aria-label", isLong ? "作品长图，可上下滚动" : "作品图片");
  dialog.scrollTop = 0;
  image.src = entry.src;
  image.alt = selectedProject.title + " · " + entry.label;
  download.hidden = !isLong;
  if (isLong) {
    download.href = entry.src;
    download.download = selectedProject.title + "-" + entry.label + ".jpg";
  }
  const colorIndexes = selectedImages.map((item, index) => item.mode === entry.mode ? index : -1).filter((index) => index !== -1);
  variants.hidden = !isLong || colorIndexes.length < 2;
  if (!variants.hidden) {
    variant.replaceChildren(...colorIndexes.map((index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = detailLabels[selectedImages[index].color];
      return option;
    }));
    variant.value = String(selectedIndex);
  }
  position.textContent = entry.label + "  ·  " + (selectedIndex + 1) + " / " + count;
  for (const button of modeButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.mode === entry.mode));
  }
  for (const [thumbnailIndex, thumbnail] of [...thumbnails.children].entries()) {
    thumbnail.setAttribute("aria-current", String(thumbnailIndex === selectedIndex));
  }
}

function card(project) {
  const element = document.createElement("button");
  element.className = "work-card";
  element.type = "button";
  element.innerHTML = '<img alt="" loading="lazy"><span class="card-copy"><span><strong></strong><small></small></span><span class="plus" aria-hidden="true">＋</span></span>';
  element.querySelector("img").src = project.coverSource ?? imageSource(project, 0);
  element.querySelector("strong").textContent = project.title;
  element.querySelector("small").textContent = project.type;
  element.addEventListener("click", () => openGallery(project));
  return element;
}

const featuredProjects = [projects[1], projects[2], projects[0], projects[3]];
const collectionsList = document.querySelector("#collections-list");
const collections = [[projects[1], 3], [projects[2], 3], [projects[0], 0], [projects[3], 3], [f03l, 1], [f03Footrest, 0]];
for (const [project, cover] of collections) {
  const collection = document.createElement("button");
  collection.className = "collection";
  collection.type = "button";
  const photo = document.createElement("img");
  photo.src = imageSource(project, cover);
  photo.alt = "";
  const name = document.createElement("span");
  name.textContent = project.title;
  collection.append(photo, name);
  collection.addEventListener("click", () => openGallery(project));
  collectionsList.append(collection);
}
document.querySelector("#featured-work").append(...featuredProjects.map(card));
document.querySelector("#more-work").append(...projects.slice(4).map(card));
document.querySelector("#archive-work").append(...archiveProjects.map(card));
document.querySelector("#open-development").addEventListener("click", () => openGallery(development));
document.querySelector("#open-child-bed").addEventListener("click", () => openGallery(childBed));
for (const button of modeButtons) {
  button.addEventListener("click", () => {
    const currentColor = selectedImages[selectedIndex].color;
    const matching = selectedImages.findIndex((entry) => entry.mode === button.dataset.mode && entry.color === currentColor);
    showImage(matching >= 0 ? matching : selectedImages.findIndex((entry) => entry.mode === button.dataset.mode));
  });
}
variant.addEventListener("change", () => showImage(Number(variant.value)));
document.querySelector("#previous").addEventListener("click", () => showImage(selectedIndex - 1));
document.querySelector("#next").addEventListener("click", () => showImage(selectedIndex + 1));
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("keydown", (event) => {
  if (controls.hidden || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  showImage(selectedIndex + (event.key === "ArrowLeft" ? -1 : 1));
});
