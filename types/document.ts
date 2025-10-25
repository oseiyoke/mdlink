export interface Document {
  id: string;
  title: string;
  content: string;
  edit_key: string;
  created_at: string;
  updated_at: string;
  view_count: number;
}

export interface DocumentResponse {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  // edit_key is intentionally omitted for security
}

export interface CreateDocumentRequest {
  title?: string;
  content?: string;
}

export interface CreateDocumentResponse {
  id: string;
  edit_key: string;
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: string;
  edit_key: string;
}

export interface ValidateEditKeyRequest {
  edit_key: string;
}

export interface ValidateEditKeyResponse {
  valid: boolean;
}
