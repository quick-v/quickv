import { QvForm, QvInput } from "./validation";
const qvForm = new QvForm("form");

const dz = document.querySelector("button");
qvForm.onInit((qvForm) => {
  //console.log(qvForm);
});

qvForm.onFails((qv) => {
  dz?.setAttribute("disabled", "true");
});

qvForm.onPasses((qv) => {
  dz?.removeAttribute("disabled");
});

dz?.addEventListener("click", (e) => {
  qvForm.update();
});

qvForm.onUpdate((qv) => {
  console.log("Form updated", qv.passes());
  dz?.setAttribute("disabled", "true");
});
qvForm.init();
