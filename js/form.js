// Инициализация элементов формы
const [firstNameField, lastNameField, ageField, emailField, passwordField, confPasswordField] = [
    document.querySelector('[data-first-name="firstName"]'),
    document.querySelector('[data-last-name="lastName"]'),
    document.querySelector('[data-age="age"]'),
    document.querySelector('[data-email="email"]'),
    document.querySelector('[data-password="password"]'),
    document.querySelector('[data-password="confPassword"]')
];

// Инициализация списков ошибок полей
const [firstErrorEl, lastErrorEl, ageErrorEl, emailErrorEl, passwordErrorEl, confPasswordErrorEl] = [
    document.querySelector('[data-first-name-error="error"]'),
    document.querySelector('[data-last-name-error="error"]'),
    document.querySelector('[data-age-error="error"]'),
    document.querySelector('[data-email-error="error"]'),
    document.querySelector('[data-password-error="error"]'),
    document.querySelector('[data-password-confirm-error="error"]')
];

// Элементы формы
const
    formItems = [firstNameField, lastNameField, ageField, emailField, passwordField, confPasswordField],
    errorItems = [firstErrorEl, lastErrorEl, ageErrorEl, emailErrorEl, passwordErrorEl, confPasswordErrorEl];


// Модальное окно
const showModalWindow = document.querySelector('[data-modal="modal"]');

// На каждый инпут вешаю событие (валидация и очистка ошибок)
document.querySelectorAll('input').forEach(item => {
    // Видимость крестика инпута
    item.addEventListener('input', validation);
});

// Вешаю событие на элемент очистки инпута (крестик)
document.querySelectorAll('[data-close-input="close"]').forEach(item => {
    item.addEventListener('click', clearInputData);
});

const validState = {
    firstName: false,
    lastName: false,
    age: false,
    email: false,
    password: false,
    confPassword: false
};


/**
 * Очистка инпута
 * @param  event - событие 
 */
function clearInputData(event) {
    const
        target = event.target.closest('.close-wrapper'),
        input = target.closest('.form-item').querySelector('input');

    // очистка инпута
    input.value = '';

    // вызываем повторно событие инпута, для запуска валидации
    const newEvent = new Event('input');
    input.dispatchEvent(newEvent);

    // скрытие крестика 
    target.classList.remove('d-flex');
}


/**
 * Очистка ошибок
 * @param errors - массив ошибок
 */
function clearValidationErrors(errors) {
    errors.forEach(error => {
        error.innerText = '';
    })
}

/**
 * Очистка формы 
 * @param arrData - массив переменных пользовательских данных
 */
function clearFormFields(arrData) {
    arrData.forEach(item => {
        item.value = '';

        // отображение крестика
        toggleClearElement(item);
    });

}

/**
 * Обработчик результата валидации
 * @param event - событие
*/
function onSubmitForm(event) {
    // Отмена события по умолчанию (отправка формы)
    event.preventDefault();

    // повторно валидируем все поля
    formItems.forEach(input => {
        // вызываем повторно событие инпута, для запуска валидации
        const newEvent = new Event('input');
        input.dispatchEvent(newEvent);
    })

    const checkValidState = Object.values(validState).every(item => item == true);

    debugger
    let modalText = document.querySelector('.modal-window__text');
    // открытие модального окна 
    if (checkValidState) {
            fakeRequest().then(data => {    
                modalText.innerHTML = 'Registration successfull';
                showModal();
            }).catch(err => {
                modalText.innerHTML = `Registration failed, ${err}`;
                showModal();
            })
    }
}

/**
 * Отображение ошибок
 * @param errors - массив ошибок
 */
function showErrors(errors) {
    errors.forEach(item => {
        item.errorElement.innerText = item.errorText;
    });
}

/**
 * Отображение модального окна
*/
function showModal() {
    // Добавление класса всплывающего окна
    showModalWindow.classList.add('d-flex');
}

/**
 * Скрытие модального окна
 */
function onCloseModal() {
    showModalWindow.classList.remove('d-flex');

    // Очистка полей формы после закрытия модального окна
    clearFormFields(formItems);
    // Очистка ошибок формы
    clearValidationErrors(errorItems);
}

/**
 * Валидация полей формы
 * @param event - событие
 */
function validation(event) {
    let
        target = event.target
    validationResult = null,
        targetData = target.dataset,
        targetDataValue = Object.values(targetData)[0];
    // clearElementClassList = clearElement && clearElement.classList;


    switch (targetDataValue) {
        case 'firstName':
            validationResult = validationFirstName(firstNameField);
            validState.firstName = validationResult.result;
            break;
        case 'lastName':
            validationResult = validationLastName(lastNameField);
            validState.lastName = validationResult.result;
            break;
        case 'age':
            validationResult = validationAge(ageField);
            validState.age = validationResult.result;
            break;
        case 'email':
            validationResult = validationEmail(emailField);
            validState.email = validationResult.result;
            break;
        case 'password':
            validationResult = validationPassword(passwordField);
            validState.password = validationResult.result;
            break;
        case 'confPassword':
            validationResult = passwordCompare(confPasswordField, passwordField);
            validState.confPassword = validationResult.result;
            break;
    }

    // отображение крестика
    toggleClearElement(target);

    validationResult.result ? clearValidationErrors([validationResult.errorElement]) : showErrors([validationResult]);
}

/**
 * Тогл элемента очистки
 * @param input - инпут
 */
function toggleClearElement(input) {
    const
        clearElement = input.closest('div').querySelector('[data-close-input="close"]'),
        clearElementClassList = clearElement && clearElement.classList;

    input.value.length > 0
        ? clearElementClassList && clearElementClassList.add('d-flex')
        : clearElementClassList && clearElementClassList.remove('d-flex');
}

/**
 * Проверка длины имени 
 * @param firstName - имя
 */
function validationFirstName(firstName) {
    return {
        result: firstName.value.length > 3,
        target: firstNameField,
        errorElement: firstErrorEl,
        errorText: 'Длина менее 3-х символов'
    };
}

/**
 * Проверка длины фамилии
 * @param  secondName - фамилия
 */
function validationLastName(lastName) {
    return {
        result: lastName.value.length > 3,
        target: lastNameField,
        errorElement: lastErrorEl,
        errorText: 'Длина менее 3-х символов'
    };
}

/**
 * Валидация возраста 
 * @param age - возраст
 */
function validationAge(age) {
    return {
        result: age.value > 18 && age.value < 100,
        target: ageField,
        errorElement: ageErrorEl,
        errorText: 'Возраст не подходит'
    };
}

/**
 * Проверка длины электронной почты
 * @param email - электронная почта
 */
function validationEmail(email) {
    return {
        result: email.value.length >= 8 && email.value.length < 20,
        target: emailField,
        errorElement: emailErrorEl,
        errorText: 'Длина менee 8-ми символов'
    };
}

/**
 * Проверка длины пароля 
 * @param password - пароль
 * @param confPassword - повторный пароль
 */
function validationPassword(password) {
    return {
        result: password.value.length >= 8 && password.value.length <= 20,
        target: passwordField,
        errorElement: passwordErrorEl,
        errorText: 'Длина менее 8-ми символов'
    };
}

/**
 * Проверка идентичности паролей 
 * @param  confPassword - повторный пароль
 * @param  password - пароль
 */
function passwordCompare(confPassword, password) {
    return {
        result: confPassword.value === password.value,
        target: passwordField,
        errorElement: confPasswordErrorEl,
        errorText: 'Пароли не совпадают'
    };
}

/**
 * Фейковый запрос
 */
function fakeRequest() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const responseData = serverReponse();

            responseData.result ? resolve(responseData) : reject(responseData.errorText);
        }, 2000);
    })
}

/**
 * Ответ сервера 
 */
function serverReponse() {
    return { result: false, status: 200, errorText: 'User already exist' }
}