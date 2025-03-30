import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(this.initializeTheme());
  isDarkMode$ = this.isDarkMode.asObservable();

  constructor() {
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode.next(!this.isDarkMode.value);
    localStorage.setItem('darkMode', this.isDarkMode.value.toString());
    this.applyTheme();
  }

  private initializeTheme(): boolean {
    // Check localStorage
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    
    // Check system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(): void {
    if (this.isDarkMode.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}