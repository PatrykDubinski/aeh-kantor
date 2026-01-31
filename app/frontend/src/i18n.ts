import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "dashboard": "Dashboard",
            "rates": "Exchange Rates",
            "exchange": "Exchange",
            "wallet": "Wallet",
            "transactions": "History",
            "buy": "BUY",
            "sell": "SELL",
            "currency": "Currency",
            "rate": "Rate",
            "amount": "Amount",
            "history": "Transaction History",
            "current_rates": "Current Exchange Rates",
            "top_up": "Top Up",
            "balance": "Balance",
            "login": "Login",
            "register": "Register",
            "email": "Email",
            "password": "Password",
            "base_currency": "Base Currency",
            "success": "Success",
            "error": "Error",
            "welcome": "Welcome",
            "top_up_success": "Topped up {{amount}} PLN",
            "top_up_failed": "Failed to top up",
            "account_actions": "Account Actions",
            "simulate_top_up": "Simulate Top Up ({{amount}} PLN)",
            "insufficient_funds": "Insufficient funds",
            "confirm_exchange": "Confirm Exchange",
            "welcome_back": "Welcome back",
            "logging_in": "Logging in...",
            "login_failed": "Login failed",
            "no_account_register": "Don't have an account? Register",
            "creating": "Creating...",
            "account_created": "Account created! You can now log in.",
            "registration_failed": "Registration failed",
            "fill_all_fields": "Please fill all fields",
            "already_have_account": "Already have an account? Log in",
            "exchange_success": "Exchange successful",
            "exchange_failed": "Exchange failed",
            "select_currency": "Select Currency",
            "transaction_type": "Transaction Type",
            "invalid_amount": "Please enter a valid amount",
            "enter_amount": "Enter amount",
            "total_cost": "Total Cost",
            "total_received": "Total Received",
            "no_transactions": "No transactions found",
            "no_wallets": "No wallets found",
            "currency_code": "Currency Code"
        }
    },
    pl: {
        translation: {
            "dashboard": "Panel Główny",
            "rates": "Kursy Walut",
            "exchange": "Wymiana",
            "wallet": "Portfel",
            "transactions": "Historia",
            "buy": "KUPNO",
            "sell": "SPRZEDAŻ",
            "currency": "Waluta",
            "rate": "Kurs",
            "amount": "Kwota",
            "history": "Historia Transakcji",
            "current_rates": "Aktualne Kursy Walut",
            "top_up": "Doładuj",
            "balance": "Saldo",
            "login": "Zaloguj się",
            "register": "Zarejestruj się",
            "email": "E-mail",
            "password": "Hasło",
            "base_currency": "Waluta Bazowa",
            "success": "Sukces",
            "error": "Błąd",
            "welcome": "Witaj",
            "top_up_success": "Doładowano {{amount}} PLN",
            "top_up_failed": "Błąd doładowania",
            "account_actions": "Akcje konta",
            "simulate_top_up": "Symuluj doładowanie ({{amount}} PLN)",
            "insufficient_funds": "Niewystarczające środki",
            "confirm_exchange": "Potwierdź wymianę",
            "exchange_success": "Wymiana zakończona sukcesem",
            "exchange_failed": "Błąd wymiany",
            "select_currency": "Wybierz walutę",
            "transaction_type": "Typ transakcji",
            "invalid_amount": "Proszę podać poprawną kwotę",
            "enter_amount": "Wpisz kwotę",
            "total_cost": "Całkowity koszt",
            "total_received": "Otrzymasz",
            "no_transactions": "Brak transakcji w historii",
            "no_wallets": "Brak dostępnych walut",
            "currency_code": "Kod waluty",
            "welcome_back": "Witaj ponownie",
            "logging_in": "Logowanie...",
            "login_failed": "Logowanie nie powiodło się",
            "no_account_register": "Nie masz konta? Zarejestruj się",
            "creating": "Tworzenie...",
            "account_created": "Konto zostało utworzone! Możesz się zalogować.",
            "registration_failed": "Rejestracja nie powiodła się",
            "fill_all_fields": "Proszę wypełnić wszystkie pola",
            "already_have_account": "Masz już konto? Zaloguj się"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'pl',
        fallbackLng: 'pl',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
