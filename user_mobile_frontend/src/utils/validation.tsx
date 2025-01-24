export default class Validation {

  private static emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private static nonCharacterRegex = /.*[\W\d]+.*/;
  private static twoWordsRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
  private static cityCodeRegex = /\d{2}( ?- ?)\d{3}/;
  private static houseNumberRegex = /^\d+([a-zA-Z])?([/\\\-]\d+([a-zA-Z])?)?$/;
  private static polishPhoneNumberRegex = /^(\+\d{2} ?)?\d{3}[ \-]?\d{3}[ \-]?\d{3}$/;
  private static fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;

  static isNameValid(input: string): string | null {
    if (input.trim() === "") return "Pole nie może być puste";
    if (this.isNonCharacter(input)) return "Imię nie może zawierać znaków specjalnych";
    return null;
  }

  static isSurnameValid(input: string): string | null {
    if (input.trim() === "") return "Pole nie może być puste";
    if (this.isNonCharacter(input)) return "Nazwisko nie może zawierać znaków specjalnych";
    return null;
  }

  static isFullNameValid(input: string): string | null {
    if (input.trim() === "") return "Pole nie może być puste";
    if (!this.isTwoWords(input)) return "Pełne imię musi być dwuczłonowe z samych liter";

    return null;
  }

  static isPhoneValid(input: string): string | null {
    if (input.trim() === "") return "Pole nie może być puste";
    if (!this.resemblesPolishPhoneNumber(input)) return "Niepoprawny format numeru telefonu";
    return null;
  }

  static isCityValid(input: string): string | null {
    if (input.trim() === "") return "Pole nie może być puste";
    if (this.isNonCharacter(input)) return "Nazwa miasta powinna składać się z liter";
    return null;
  }

  static isCityCodeValid(input: string): string | null {
    if (input.trim() === "") return "Pole nie może być puste";
    if (!this.resemblesCityCode(input)) return "Prawidłowy format to \"dd-ddd\", np \"33-230\"";
    return null;
  }

  static isStreetValid(input: string): string | null {
    if (input.trim() === "") return "Pole nie może być puste";
    if (this.isNonCharacter(input)) return "Nazwa miasta powinna składać się z liter";
    return null;
  }

  static isHouseNumberValid(input: string): string | null {
    if (input.trim() === "") return "Pole nie może być puste";
    if (!this.resemblesHouseNumber(input)) return "Dozwolone formaty numeru domu to: \"23\", \"23a\", \"2/32\", \"23b-32\"";
    return null;
  }

  static isEmailValid(input: string): string | null {
    if (input.trim() === "") return "Pole nie może być puste";
    if (!this.resemblesEmail(input)) return "Nieprawidłowy email";
    return null;
  }

  static isPasswordValid(input: string): string | null {
    if (input.trim() === "") return "Pole nie może być puste";
    if (input.length < 8) return "Hasło nie może być krótsze niż 8 znaków";
    return null;
  }

  static isDateOfBirthValid(input: string): string | null {
    return input.trim() === "" ? "Pole nie może być puste" : null;
  }

  static isEmpty(input: string): string | null {
    return input.trim() === "" ? "Pole nie może być puste" : null;
  }

  private static isNonCharacter(str: string): boolean {
    return this.nonCharacterRegex.test(str);
  }

  private static resemblesCityCode(str: string): boolean {
    return this.cityCodeRegex.test(str);
  }

  private static resemblesHouseNumber(str: string): boolean {
    return this.houseNumberRegex.test(str);
  }

  private static resemblesPolishPhoneNumber(str: string): boolean {
    return this.polishPhoneNumberRegex.test(str);
  }

  private static resemblesEmail(str: string): boolean {
    return this.emailRegex.test(str);
  }
  private static isTwoWords(str: string): boolean {
    return this.twoWordsRegex.test(str);
  }
}
