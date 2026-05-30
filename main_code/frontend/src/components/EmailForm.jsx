/**
 * EmailForm — input fields for the email being analyzed.
 */
export default function EmailForm({ formData, onChange }) {
  function handleChange(e) {
    onChange({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <section className="glass-card email-form" id="email-form">
      <div className="email-form__header">
        <span className="email-form__icon">📧</span>
        <h2 className="email-form__title">Email Content</h2>
      </div>

      <div className="email-form__grid">
        <div className="email-form__group">
          <label className="email-form__label" htmlFor="sender-input">
            Sender Address
          </label>
          <input
            id="sender-input"
            className="email-form__input"
            type="email"
            name="sender"
            placeholder="suspicious@domain.com"
            value={formData.sender}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className="email-form__group">
          <label className="email-form__label" htmlFor="timestamp-input">
            Timestamp
          </label>
          <input
            id="timestamp-input"
            className="email-form__input"
            type="text"
            name="timestamp"
            placeholder="2026-05-27 14:32:00"
            value={formData.timestamp}
            onChange={handleChange}
          />
        </div>

        <div className="email-form__group email-form__group--full">
          <label className="email-form__label" htmlFor="subject-input">
            Subject Line
          </label>
          <input
            id="subject-input"
            className="email-form__input"
            type="text"
            name="subject"
            placeholder="Urgent: Verify your account immediately"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>

        <div className="email-form__group email-form__group--full">
          <label className="email-form__label" htmlFor="body-input">
            Email Body
          </label>
          <textarea
            id="body-input"
            className="email-form__textarea"
            name="body"
            placeholder="Paste the full email body here for analysis…"
            value={formData.body}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
}
