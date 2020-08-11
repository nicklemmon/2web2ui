import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { SparkPost } from 'src/components';
import { Inline, ScreenReaderOnly } from 'src/components/matchbox';
import findRouteByPath from 'src/helpers/findRouteByPath';
import AccountPopover from './AccountPopover';
import styles from './DesktopNavigation.module.scss';
import { hibanaRoutes } from 'src/config/routes';

export default function DesktopNavigation(props) {
  const { navItems, location } = props;
  const { category, subcategory } = findRouteByPath(location.pathname, undefined, hibanaRoutes);

  const isCategoryActive = navItem => category === navItem.label;

  return (
    <div className={styles.DesktopNavigation} data-id="desktop-navigation">
      <NavWrapper>
        <SkipLink />

        <div className={styles.PrimaryNavLayout}>
          <div className={styles.LogoWrapper}>
            <Link to="/dashboard">
              <SparkPost.Logo className={styles.Logo} />
            </Link>
          </div>

          <nav className={styles.PrimaryNav} aria-labelledby="primary-nav-heading">
            {/* Visually hidden headings to help guide screen reader users */}
            <ScreenReaderOnly as="div">
              <h2 id="primary-nav-heading">Main</h2>
            </ScreenReaderOnly>

            <Inline>
              {navItems.map((item, index) => {
                return (
                  <NavLink
                    variant="primary"
                    to={item.to}
                    key={`nav-item-${index}`}
                    isActive={isCategoryActive(item)}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </Inline>
          </nav>

          <AccountPopover />
        </div>
      </NavWrapper>

      {navItems.map(item => {
        if (isCategoryActive(item) && item.children) {
          return (
            <nav
              className={styles.SecondaryNav}
              key="secondary-nav"
              aria-labelledby="secondary-nav-heading"
              data-id="secondary-navigation"
            >
              <NavWrapper>
                {/* Visually hidden headings to help guide screen reader users */}
                <ScreenReaderOnly as="div">
                  <h3 id="secondary-nav-heading">Secondary</h3>
                </ScreenReaderOnly>

                <Inline>
                  {item.children.map((childItem, index) => {
                    return (
                      <NavLink
                        variant="secondary"
                        to={childItem.to}
                        key={`subnav-item-${index}`}
                        isActive={subcategory === childItem.label}
                      >
                        {childItem.label}
                      </NavLink>
                    );
                  })}
                </Inline>
              </NavWrapper>
            </nav>
          );
        }

        return null;
      })}
    </div>
  );
}

function NavWrapper({ children }) {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.SubWrapper}>{children}</div>
    </div>
  );
}

function NavLink(props) {
  const { variant, children, to, isActive } = props;

  return (
    <Link
      to={to}
      className={classNames(styles.NavLink, styles[variant], isActive ? styles.isActive : null)}
    >
      {children}
    </Link>
  );
}

// Allows keyboard-only users to skip the navigation
// See: https://webaim.org/techniques/skipnav/
function SkipLink() {
  return (
    <a href="#main-content" className={styles.SkipLink}>
      Skip to Main Content
    </a>
  );
}
