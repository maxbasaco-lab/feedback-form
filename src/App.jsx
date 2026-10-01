import FeedbackForm from "./components/FeedbackForm";

function App() {
  return (
    <div className="app">
      <h1 style={{ textAlign: "center", fontFamily: "system-ui", marginTop: "20px" }}>
        Форма обратной связи
      </h1>
      <FeedbackForm />
    </div>
  );
}

export default App;