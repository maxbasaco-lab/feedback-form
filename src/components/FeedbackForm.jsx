import { useState } from "react";
import "./FeedbackForm.css";

// Вспомогательная функция для маски телефона: +7 (XXX) XXX-XX-XX
const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  let formatted = "+7";
  if (digits.length > 1) {
    formatted += " (" + digits.substring(1, 4);
  }
  if (digits.length >= 5) {
    formatted += ") " + digits.substring(4, 7);
  }
  if (digits.length >= 8) {
    formatted += "-" + digits.substring(7, 9);
  }
  if (digits.length >= 10) {
    formatted += "-" + digits.substring(9, 11);
  }
  return formatted;
};

function FeedbackForm() {
  // --- Состояния полей ---
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [wantResponse, setWantResponse] = useState(true);
  const [message, setMessage] = useState("");

  // --- Состояния ошибок ---
  const [errors, setErrors] = useState({
    name: null,
    phone: null,
    email: null,
    message: null,
  });

  // --- Состояние touched ---
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    email: false,
    message: false,
  });

  // --- Состояния отправки ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- Валидаторы ---
  const validateName = (val) => {
    if (!val.trim()) return "Имя обязательно для заполнения";
    if (val.trim().length < 2) return "Минимум 2 символа";
    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(val.trim()))
      return "Только буквы, пробелы и дефис";
    return null;
  };

  const validatePhone = (val) => {
    if (!val.trim()) return "Телефон обязателен для заполнения";
    if (val.length < 18) return "Введите полный номер телефона";
    return null;
  };

  const validateEmail = (val, isRequired) => {
    if (isRequired && !val.trim()) return "Email обязателен для связи";
    if (val.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()))
      return "Некорректный формат email";
    return null;
  };

  const validateMessage = (val) => {
    if (!val.trim()) return "Сообщение обязательно для заполнения";
    if (val.trim().length < 10) return "Минимум 10 символов";
    if (val.length > 500) return "Максимум 500 символов";
    return null;
  };

  const runValidation = (field, value, isResponseRequired = wantResponse) => {
    switch (field) {
      case "name":
        return validateName(value);
      case "phone":
        return validatePhone(value);
      case "email":
        return validateEmail(value, isResponseRequired);
      case "message":
        return validateMessage(value);
      default:
        return null;
    }
  };

  // --- Обработчики событий ---
  const handleChange = (field, value) => {
    let newValue = value;

    if (field === "name") setName(newValue);
    if (field === "phone") {
      newValue = formatPhoneNumber(value);
      setPhone(newValue);
    }
    if (field === "email") setEmail(newValue);
    if (field === "message") setMessage(newValue);

    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: runValidation(field, newValue),
      }));
    }
  };

  const handleCheckboxChange = (checked) => {
    setWantResponse(checked);
    if (touched.email) {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(email, checked),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const currentVal =
      field === "name"
        ? name
        : field === "phone"
        ? phone
        : field === "email"
        ? email
        : message;

    setErrors((prev) => ({
      ...prev,
      [field]: runValidation(field, currentVal),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
      phone: validatePhone(phone),
      email: validateEmail(email, wantResponse),
      message: validateMessage(message),
    };

    setErrors(newErrors);
    setTouched({ name: true, phone: true, email: true, message: true });

    if (Object.values(newErrors).some((err) => err !== null)) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const getInputClass = (field) => {
    const classes = ["field__input"];
    if (touched[field] && errors[field]) {
      classes.push("field__input--error");
    } else if (touched[field] && !errors[field]) {
      classes.push("field__input--valid");
    }
    if (field === "message") {
      classes.push("field__input--textarea");
    }
    return classes.join(" ");
  };

  if (submitted) {
    return (
      <div className="feedback-form feedback-form--success">
        <h2 className="feedback-form__title">Спасибо за обращение!</h2>
        <p className="feedback-form__text">
          Мы свяжемся с вами в ближайшее время.
        </p>
        <button
          type="button"
          className="feedback-form__submit"
          onClick={() => {
            setName("");
            setPhone("");
            setEmail("");
            setMessage("");
            setWantResponse(true);
            setErrors({ name: null, phone: null, email: null, message: null });
            setTouched({ name: false, phone: false, email: false, message: false });
            setSubmitted(false);
          }}
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      {/* Имя */}
      <div className="field">
        <label htmlFor="name" className="field__label">
          Имя *
        </label>
        <input
          id="name"
          type="text"
          className={getInputClass("name")}
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          placeholder="Иван Иванов"
        />
        {touched.name && errors.name && (
          <span className="field__error">{errors.name}</span>
        )}
      </div>

      {/* Телефон */}
      <div className="field">
        <label htmlFor="phone" className="field__label">
          Телефон *
        </label>
        <input
          id="phone"
          type="tel"
          className={getInputClass("phone")}
          value={phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          placeholder="+7 (999) 000-00-00"
        />
        {touched.phone && errors.phone && (
          <span className="field__error">{errors.phone}</span>
        )}
      </div>

      {/* Чекбокс ответа */}
      <div className="field field--checkbox">
        <label className="checkbox__label">
          <input
            type="checkbox"
            checked={wantResponse}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
          />
          Хочу получить ответ на email
        </label>
      </div>

      {/* Email */}
      <div className="field">
        <label htmlFor="email" className="field__label">
          Email {wantResponse ? "*" : "(необязательно)"}
        </label>
        <input
          id="email"
          type="email"
          className={getInputClass("email")}
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          placeholder="example@mail.ru"
        />
        {touched.email && errors.email && (
          <span className="field__error">{errors.email}</span>
        )}
      </div>

      {/* Сообщение + Счётчик */}
      <div className="field">
        <div className="field__header">
          <label htmlFor="message" className="field__label">
            Сообщение *
          </label>
          <span
            className={`character-counter ${
              message.length >= 500 ? "character-counter--limit" : ""
            }`}
          >
            {message.length} / 500
          </span>
        </div>
        <textarea
          id="message"
          className={getInputClass("message")}
          value={message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          rows={5}
          maxLength={500}
          placeholder="Опишите ваш вопрос..."
        />
        {touched.message && errors.message && (
          <span className="field__error">{errors.message}</span>
        )}
      </div>

      {/* Кнопка */}
      <button
        type="submit"
        className="feedback-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Отправка…" : "Отправить"}
      </button>
    </form>
  );
}

export default FeedbackForm;