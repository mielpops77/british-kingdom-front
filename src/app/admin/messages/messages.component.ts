import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ContactService } from '../../components/Services/contact.service';
import { Contact } from '../../models/contact';

@Component({
  selector: 'app-admin-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, DatePipe]
})
export class AdminMessagesComponent implements OnInit {
  contacts: Contact[] = [];
  loading = true;
  expandedId: number | null = null;
  deletingId: number | null = null;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.contactService.getAllContacts(environment.id).subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get unreadCount(): number {
    return this.contacts.filter(c => !c.vue).length;
  }

  toggleExpand(contact: Contact): void {
    this.expandedId = this.expandedId === contact.id ? null : contact.id;

    if (!contact.vue) {
      contact.vue = true;
      this.contactService.updateContact(contact.id, contact).subscribe();
    }
  }

  confirmDelete(contact: Contact, event: Event): void {
    event.stopPropagation();
    if (!confirm(`Supprimer le message de "${contact.name}" ?`)) return;

    this.deletingId = contact.id;
    this.contactService.deleteContact(contact.id).subscribe({
      next: () => {
        this.contacts = this.contacts.filter(c => c.id !== contact.id);
        this.deletingId = null;
      },
      error: () => {
        alert('La suppression a échoué.');
        this.deletingId = null;
      }
    });
  }
}
