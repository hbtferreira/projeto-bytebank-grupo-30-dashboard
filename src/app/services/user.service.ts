import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/response.interface';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService<User> {
  constructor(http: HttpClient) {
    super(http, 'user');
  }

  /**
   * Busca todos os usuários
   * Baseado no método find do UserController
   */
  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/user`);
  }

  /**
   * Atualiza um usuário
   * Baseado no método update do UserController
   */
  updateUser(id: string, userData: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/user/${id}`, userData);
  }

  /**
   * POST /user
   * Cria um novo usuário
   * Baseado no método create do UserController
   */
  createUser(userData: { username: string; email: string; password: string }): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/user`, userData);
  }

  /**
   * POST /user/auth
   * Autenticação de usuário
   * Baseado no método auth do UserController
   */
  authUser(credentials: { email: string; password: string }): Observable<ApiResponse<{ token: string }>> {
    return this.http.post<ApiResponse<{ token: string }>>(`${this.baseUrl}/user/auth`, credentials);
  }
}
