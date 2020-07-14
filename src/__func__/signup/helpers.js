import MockRecaptcha from 'src/__testHelpers__/mockRecaptcha';
import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';
import config from 'src/config';

jest.mock('react-recaptcha', () => MockRecaptcha);

export const freePlanPredicate = plan => /free/.test(plan.code);

class SignupFlow {
  constructor() {
    config.featureFlags.has_signup = true;
  }

  async _mount() {
    this.page = await mountRoute('/join', { authenticated: false });
    this.formFiller = getFormFiller(this.page.wrapper);
    for (const prop in this.page) {
      this[prop] = this.page[prop];
    }
  }

  async signup({ optIn = false } = {}) {
    this.formFiller([
      { name: 'first_name', value: 'Firsty' },
      { name: 'last_name', value: 'Ferret' },
      { name: 'email', value: 'test-username@example.com' },
      { name: 'password', value: 'test-password' },
      { name: 'tou_accepted', value: true, type: 'checkbox' },
      { name: 'email_opt_in', value: optIn, type: 'checkbox' },
    ]);
    await this.page.simulate('button[id="submit"]', 'click');
  }
}

export default async () => {
  const flow = new SignupFlow();
  await flow._mount();
  return flow;
};
