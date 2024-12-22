# Testowanie i Jakość Oprogramowania

## Autor
Imię i nazwisko autora: **Arkadiusz Kupiec**

## Temat projektu
**Aplikacja do zamawiania posiłków**

## Opis projektu
Ten projekt to aplikacja mobilno-webowa dla systemu zarządzania zamówieniami w pizzerii. Umożliwia ona zarządzanie menu, składanie zamówień, oraz zarządzanie użytkownikami. Projekt został zaimplementowany w oparciu o **Spring Boot** i zawiera zarówno testy jednostkowe, jak i integracyjne. Interfejs aplikacji (w ramach projektu) został zaimplementowany w **React Native** i znajduje się w (/mobile_frontend)[./mobile_frontend]

## Uruchomienie projektu
Aby uruchomić należy:
1. uruchomić aplikację serwerową z katalogu [./backend](./backend) poleceniem: "mvn spring-boot:run"
2. uruchomić aplikację mobilną z katalogu [./user_mobile_frontend](./user_mobile_frontend) polecenim: "npx expo start"
3. aplikację mobilną uruchomić na emulatorze albo bezpośrednio na urządzeniu za pomocą "expo"

## Testy

### Testy jednostkowe
W projekcie zaimplementowano testy jednostkowe dla kluczowych komponentów backendu. Testy te sprawdzają poprawność działania metod i interfejsów używanych w aplikacji. Poniżej znajdują się szczegóły:

#### Testy kontrolerów
- **`DrinkControllerTest`**  
  Lokalizacja: [backend/controller/unit/DrinkControllerTest.java](./backend/src/test/java/com/example/Pizzeriabackend/controller/unit/DrinkControllerTest.java)  
  **Opis:**  
  Testy obejmują sprawdzanie endpointów zarządzających napojami. Testowane są m.in.:
  - Pobieranie listy napojów (`GET /api/drink`).
  - Pobieranie konkretnego napoju po ID (`GET /api/drink/{id}`).
  - Tworzenie nowego napoju (`POST /api/drink`).
  - Usuwanie napojów (`DELETE /api/drink/{id}` i `DELETE /api/drink`).

#### Testy repozytoriów
- **`RefreshTokenRepositoryTest`**  
  Lokalizacja: [backend/repository/RefreshTokenRepositoryTest.java](./backend/src/test/java/com/example/Pizzeriabackend/repository/RefreshTokenRepositoryTest.java)  
  **Opis:**  
  Testy jednostkowe sprawdzające działanie metod repozytorium `RefreshTokenRepository`. Obejmują:
  - Wyszukiwanie tokenu na podstawie wartości.
  - Usuwanie wszystkich tokenów powiązanych z użytkownikiem.

#### Testy serwisów
- **`IngredientServiceImpTest`**  
  Lokalizacja: [backend/service/IngredientServiceImpTest.java](./backend/src/test/java/com/example/Pizzeriabackend/service/IngredientServiceImpTest.java)  
  **Opis:**  
  Testy sprawdzające logikę biznesową dla składników pizzy. Obejmują:
  - Tworzenie nowego składnika.
  - Pobieranie wszystkich składników.
  - Aktualizację składnika.
  - Usuwanie składnika.

### Testy integracyjne
W projekcie zaimplementowano testy integracyjne dla kluczowych komponentów backendu. Testy te sprawdzają współdziałanie różnych warstw aplikacji i ich poprawność w bardziej złożonych scenariuszach. Poniżej znajdują się szczegóły:

#### Testy kontrolera składników (`IngredientControllerIntegrationTest`)
- **Lokalizacja:**  
  [backend/controller/integration/IngredientControllerIntegrationTest.java](./backend/src/test/java/com/example/Pizzeriabackend/controller/integration/IngredientControllerIntegrationTest.java)  
  **Opis:**  
  Testy integracyjne dla kontrolera składników pizzy, które obejmują:
  - **Tworzenie składnika przez użytkownika bez uprawnień:**  
    Próba utworzenia nowego składnika przez użytkownika o roli `USER` kończy się błędem `403 Forbidden`.
  - **Usuwanie składnika przez użytkownika bez uprawnień:**  
    Próba usunięcia składnika przez użytkownika o roli `USER` kończy się błędem `403 Forbidden`.
  - **Tworzenie składnika przez administratora:**  
    Administrator z powodzeniem tworzy nowy składnik. Test weryfikuje poprawność zapisanych danych w bazie.
  - **Pobieranie listy składników:**  
    Test sprawdza, czy można pobrać wszystkie składniki i czy zwrócona lista zawiera oczekiwane dane.

#### Testy kontrolerów pizzy (`PizzaControllerIntegrationTest`)
- **Lokalizacja:**  
  [backend/controller/integration/PizzaControllerIntegrationTest.java](./backend/src/test/java/com/example/Pizzeriabackend/controller/integration/PizzaControllerIntegrationTest.java)  
  **Opis:**  
  Testy integracyjne dla kontrolera pizzy, które obejmują:
  - **Pobieranie listy pizz:**  
    Test weryfikuje, czy można pobrać wszystkie pizze i czy odpowiedź zawiera poprawne dane.
  - **Tworzenie pizzy przez administratora:**  
    Administrator z powodzeniem tworzy nową pizzę, a test weryfikuje dane w odpowiedzi oraz zapisane dane w bazie.
  - **Tworzenie pizzy bez tokena uwierzytelniającego:**  
    Próba utworzenia pizzy bez tokena uwierzytelniającego w nagłówku kończy się błędem `403 Forbidden`.
  - **Usuwanie pizzy:**  
    Administrator z powodzeniem usuwa istniejącą pizzę. Test weryfikuje, czy dane zostały poprawnie usunięte z bazy.
  - **Usuwanie pizzy przez użytkownika bez uprawnień:**  
    Próba usunięcia pizzy przez użytkownika o roli `USER` kończy się błędem `403 Forbidden`.
  - **Pobieranie pizzy po ID:**  
    Test sprawdza, czy można poprawnie pobrać szczegóły pizzy na podstawie jej ID, w tym jej składniki.
    
### Przypadki testowe dla testera manualnego (test cases)
- **TC0001**: Walidacja pól logowania
- **TC0002**: Walidacja pola “Imię” w ekranie Rejestracji
- **TC0003**: Walidacja pola “email” w ekranie Rejestracji
- **TC0004**: Walidacja pola “Kod pocztowy” w ekranie Rejestracji
- **TC0005**: Przejście do menu bez logowania
- **TC0006**: Dodanie pizzy do koszyka
- **TC0007**: Przejście do ekranu koszyka
- **TC0008**: Zwiększenie ilości pozycji w koszyku
- **TC0009**: Zmniejszenie ilości pozycji w koszyku
- **TC0010**: Usunięcie wszystkich pozycji z koszyka

Lokalizacja pliku z tabelką: [Przypadki testowe](./backend/src/test/resources/test-cases.docx)  

## Przykładowe działanie aplikacji
<a href="https://drive.google.com/file/d/184CwsExBseBtXPaFgk1bBUcYAZ9qLGQ-/view?usp=sharing"><img src="http://img.youtube.com/vi/wkhmERX4cZU/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="330" height="240" border="10" /></a>
