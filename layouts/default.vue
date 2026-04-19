<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="site-header__inner">
        <NuxtLink to="/" class="brand-mark" aria-label="IELTS Mock Test Platform — home">
          <span class="brand-mark__logo" aria-hidden="true">
            <Icon name="sparkles" :size="20" />
          </span>
          <span class="brand-mark__text">
            <span class="brand-mark__title">IELTS Practice</span>
            <span class="brand-mark__sub">Cambridge-style mock tests</span>
          </span>
        </NuxtLink>
        <nav class="site-nav" aria-label="Primary">
          <NuxtLink to="/tests" class="site-nav__link">
            <Icon name="list" :size="16" />
            <span>Tests</span>
          </NuxtLink>
          <NuxtLink to="/tests" class="site-nav__link site-nav__link--cta">
            <Icon name="play" :size="16" />
            <span>Start mock</span>
          </NuxtLink>
        </nav>
      </div>
    </header>
    <main class="app-main">
      <slot />
    </main>
    <footer class="site-footer">
      <div class="site-footer__inner">
        <p class="site-footer__brand">IELTS Practice Platform</p>
        <p class="site-footer__note">Full-length, Cambridge-style mock tests for Academic IELTS candidates.</p>
      </div>
    </footer>
  </div>
</template>
