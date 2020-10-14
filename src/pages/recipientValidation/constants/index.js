export const DELIVERY_CONFIDENCE_TOOLTIP =
  "The Delivery Confidence Score is a number between 0-100 which represents SparkPost's confidence that the email address can be delivered to.";

export const ROLE_TOOLTIP =
  'Role email addresses represent a group or activity (sales, abuse) \
  and not an individual. They tend to have a lower engagement rate and a higher unsubscribe rate.';

export const DISPOSABLE_TOOLTIP =
  'Disposable email providers are services that create email \
  addresses that are discarded after one use or a short time period. These addresses should be avoided.';

export const FREE_TOOLTIP =
  'Free email providers such as Gmail allow anyone to sign up \
  for an email address. Businesses may consider blocking these to eliminate low-quality leads.';

export const DID_YOU_MEAN_TOOLTIP =
  '"Did you mean" indicates a likely typo in the domain for \
the given email address. This helps you catch human typos and spam traps before you add them to your list.';

export const RESULT_DESCRIPTIONS = {
  valid:
    'Our data indicates we have seen deliveries and/or active engagement associated with this email address. We have no data suggesting that this is an invalid email address for any reason.',
  neutral:
    'Our data indicates we have not seen any bounces associated with this email address that would suggest it to be invalid or undeliverable to. However, we have not seen any specific delivery and/or engagement events associated as well.',
  risky:
    'A risky result means that our data analysis indicated that the email address has bounced at least once in the past, but has not seen a subsequent bounce in quite some time. Data suggests this email address can in fact be delivered to, however there is some potential risk of the email address bouncing.',
  undeliverable: 'Our data strongly indicates this email address cannot be delivered to.',
  typo:
    'Our data indicates there is likely a typo in the domain for this email address. Check “did you mean” for our best recommendation to fix the misspelled domain.',
};
