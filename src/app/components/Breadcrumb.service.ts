import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  breadcrumbs: { label: string; url: string }[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: { label: string; url: string }[] = []
  ): { label: string; url: string }[] {
    const routeData = route.snapshot.data;
    const label = routeData['breadcrumb'];

    if (label) {
      const nextUrl = `${url}/${route.snapshot.url.map((segment) => segment.path).join('/')}`;
      breadcrumbs.push({ label, url: nextUrl });

      if (route.children.length > 0) {
        route.children.forEach((child) => {
          this.createBreadcrumbs(child, nextUrl, breadcrumbs);
        });
      }
    }

    return breadcrumbs;
  }
}
