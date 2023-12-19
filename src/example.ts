import { QvForm, QvInput } from "./validation";
const qvForm = new QvForm("form");

qvForm.onInit((qv) => {
  //L'instance QvForm est prête
});

qvForm.onFails((qv) => {
  //Le formulaire a échoué
});

qvForm.onPasses((qv) => {
  //Le formulaire passe
});

qvForm.onUpdate((qv) => {
  //Le formulaire est mise à jour, ajout ou retrait d'un nouveau champ
});

qvForm.init();
