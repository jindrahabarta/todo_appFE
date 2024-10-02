# TODOAPP Dokumentace - Frontend

Aplikace je vytvořena za účelem vyzkoušení mých znalostí firmou ([SnowlyCode](https://www.snowlycode.com/)).

## Použité knihovny

-   [React Router](https://reactrouter.com/en/main)
-   [React Hook Form](https://react-hook-form.com/)
-   [DNDKit](https://dndkit.com/)
-   [GSAP](https://gsap.com/)
-   [Axios](https://axios-http.com/)

## Funkce

-   Načítání z LocalStorage
-   Vytvoření, mazání listu
-   Řazení, minimalizace a maximalizace listu
-   Vytvoření, mazání kartiček
-   Přesouvání kartiček mezi listama
-   Zobrazení více informací

### LocalStorage

Pokud by se při prvním načítání z databáze stala chyba, je třeba zobrazit alespoň uložené údaje z LocalStorage.

```js
useEffect(() => {
    if (!listsLoading) {
        if (listsError) {
            showOfflineAlert(true)
            const localListsData = window.localStorage.getItem('lists')
            if (localListsData) {
                setLists(JSON.parse(localListsData))
            }
        } else {
            window.localStorage.setItem('lists', JSON.stringify(listsData))
            setLists(listsData)
        }
    }
}, [listsData, listsError, listsLoading])
```

Při každém neúspěšném dotazu na server se zobrazí buď chybová hláška ve formuláři a nebo se uživateli ukáže `<OfflineModeError></OfflineModeError>`.

```js
showOfflineAlert(true)
```

### Formuláře pro vytvoření kartiček a listů

Vytváření kartiček/listů se odehrávájí v komponentách `<AddTodoForm></AddTodoForm>`, `<AddListForm></AddListForm>`. Všechny vstupy jsou omezeny na určitou povolenou délku a ochráněné před nepovolenými znaky pomocí knihovny [React Hook Form](https://react-hook-form.com/).

Zadané údaje se posílají na BE, kde probíhá kontrola zda-li už list/karta nebyly vytvořeny a zápis do provizorní JSON databáze. Zpět se posílají a setují nové údaje, v případě neúspěchu příslušné oznámení o chybě.

### Řazení listu

Řazení funguje pomocí funkce `SortList`, která přijímá aktuální data na kartě a vrací požadované pořadí kartiček na listu. Následně se nové pořadí setuje do stavu listu `currentTodos`.

### Minimalizace listu

Každý list se dá jednoduše minimalizovat a následně maximalizovat. Vše se děje jen za pomocí měnění stylů CSS.

```js
listShowed
    ? { height: 'fit-content', overflow: 'visible' }
    : { height: 60, overflow: 'hidden' }
```

### Editace, mazání a přesouvání kartiček

V každé `<TodoCard></TodoCard>` komponentě se nachází rozklikávací menu `<TodoCardMenu></TodoCardMenu>`. Obsahuje 3 možnosti.

#### 1. Editace

Při zvolení editace se otevře `<EditTodoForm></EditTodoForm>` u kterého je možnost upravit jak nadpis, tak popisek. Vstupy jsou opět chráněné a před odesláním se kontroluje, zda-li už nadpis nebo popisek neexistují někde jinde. To samé se odehrává na BE a zpět se posílají a setují nově zadané údaje.

#### 2. Mazání

Funguje velice jednoduše. Na základě zvoleného ID, se na BE filtrují všechny karty. Zpět se odesílají a setují vyfiltrované data.

#### 3. Přesouvání

Pro přesouvání jsem využil možnosti knihovny [DNDKit](https://dndkit.com/).

Po každém přetažení na jinou pozici kartičky se lokálně setuje nový stav. Na server se nové data odešlou až po puštění tlačítka myši.

Při každém přesouvání kartičky se zobrazí `<TaskDoneBin></TaskDoneBin>`. Puštěním kartičky nad touto komponentou dosáhneme přesunutí kartičky do listu "Done".

### Zobrazení více informací

Každá kartička obsahuje tlačítko pro ukázání bočního panelu `<Details></Details>`, na kterém se ukážou všechny dostupné informace. Komponenta přijímá id kartičky, které bylo uživatelem zvoleno. Na základě id se hledá zvolená kartička a vypisují se její údaje.
