import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
// import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl:"./header.component.html", 
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  isMobileMenuOpen = false;
  scrolled = false;

  navItems = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Projects', path: '/projects', exact: false },
    { label: 'Skills', path: '/skills', exact: false },
    { label: 'Experience', path: '/experience', exact: false },
    { label: 'Blog', path: '/blog', exact: false },
    { label: 'Contact', path: '/contact', exact: false }
  ];

  constructor(public themeService: ThemeService) {}

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrolled = window.scrollY > 20;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}