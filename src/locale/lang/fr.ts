import { RulesMessages } from "../../contracts";

export const fr_messages: RulesMessages = {
  default: "Ce champ est invalide",
  required: "Ce champ est requis",
  email: "Veuillez entrer une adresse e-mail valide",
  maxlength: "Le nombre maximal de caractères autorisés est: :arg0",
  minlength: "Le nombre minimal de caractères autorisés est: :arg0",
  min: "Le champ :field doit être supérieur ou égal à ':arg0'",
  max: "Le champ :field doit être inférieur ou égal à ':arg0'",
  string: "Veuillez entrer une chaîne de caractères",
  between: "La valeur de ce champ doit être comprise entre ':arg0' et ':arg1'",
  startWith: "Le champ :field doit commencer par ':arg0'",
  endWith: "Le champ :field doit se terminer par ':arg0'",
  contains: "Le champ :field doit contenir la valeur ':arg0'",
  in: "Veuillez choisir une valeur correcte pour le champ :field",
  integer: "Le champ :field doit être un entier",
  int: "Le champ :field doit être un entier",
  number: "Ce champ doit être un nombre",
  numeric: "Ce champ doit être un nombre",
  file: "Ce champ doit être un fichier",
  url: "Ce champ doit être une URL valide",
  length: "La taille de ce champ doit être :arg0",
  len: "La taille de ce champ doit être :arg0",
  maxFileSize: "La taille du fichier doit être inférieure à :arg0.",
  minFileSize: "La taille du fichier doit être supérieure à :arg0.",
  size: "La taille de ce champ doit être inférieure ou égale à :arg0",
  boolean: "Ce champ doit être un booléen (oui ou non)",
  startWithUpper: "Ce champ doit commencer par une lettre majuscule",
  startWithLower: "Ce champ doit commencer par une lettre minuscule",
  nullable: "",
  password:
    "Le mot de passe doit comporter au moins 8 caractères et inclure une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.",
  date: "Ce champ doit être une date valide",
  before: "La date doit être antérieure à (:arg0)",
  after: "La date doit être postérieure à (:arg0)",
  same: "Ce champ doit être identique à la valeur du champ :arg0",
  requiredIf:
    "Le champ :field est requis lorsque le champ :arg0 a la valeur actuelle",
  requiredWhen:
    "Le champ :field est requis lorsque les champs :arg0 sont présents",
  phone: "Ce numéro de téléphone semble être invalide",
  time: "Le champ :field doit être une heure valide.",
  startWithLetter: "Le champ :field doit commencer par une lettre",
  excludes: "Le champ :field ne doit pas contenir :arg0.",
  hasLetter: "Ce champ doit contenir au moins une lettre",
  regex: "Ce champ est invalide.",
  lower: "Ce champ doit être en minuscule",
  upper: "Ce champ doit être en majuscule",
  fileBetween: "La taille du fichier doit être comprise entre :arg0 et :arg1",
  stringBetween:
    "La longueur de ce champ doit être comprise entre :arg0 et :arg1",
};
