import * as i0 from '@angular/core';
import { InjectionToken, ModuleWithProviders } from '@angular/core';
import { Observable } from 'rxjs';

interface DBConfig {
    name: string;
    version?: number;
    objectStoresMeta: ObjectStoreMeta[];
    migrationFactory?: () => {
        [key: number]: (db: IDBDatabase, transaction: IDBTransaction) => void;
    };
    isDefault?: boolean;
}
interface ObjectStoreMeta {
    store: string;
    storeConfig: {
        keyPath: string | string[];
        autoIncrement: boolean;
        [key: string]: any;
    };
    storeSchema: ObjectStoreSchema[];
}
interface ObjectStoreSchema {
    name: string;
    keypath: string | string[];
    options: {
        unique: boolean;
        [key: string]: any;
    };
}
interface IndexDetails {
    indexName: string;
    order: string;
}
interface RequestEvent<T> extends Event {
    target: RequestEventTarget<T>;
}
interface RequestEventTarget<T> extends EventTarget {
    result: T | T[];
}
declare enum DBMode {
    readonly = "readonly",
    readwrite = "readwrite"
}
type WithID = {
    id: number;
};
type IndexKey<P extends IDBValidKey, K extends IDBValidKey> = {
    readonly primaryKey: P;
    readonly key: K;
};
type Modify<T, R> = Omit<T, keyof R> & R;
type NgxIDBCursor<P extends IDBValidKey, K extends IDBValidKey, V = any> = Modify<IDBCursor, {
    key: K;
    primaryKey: P;
    update(value: V): IDBRequest<IDBValidKey>;
}>;
type NgxIDBCursorWithValue<V = any, P extends IDBValidKey = IDBValidKey, K extends IDBValidKey = IDBValidKey> = NgxIDBCursor<P, K, V> & {
    value: V;
};
declare const CONFIG_TOKEN: InjectionToken<Record<string, DBConfig>>;
declare const INDEXED_DB: InjectionToken<IDBFactory>;
/**
 * Token used to inject the indexed db implementation on the server
 */
declare const SERVER_INDEXED_DB: InjectionToken<IDBFactory>;

declare class NgxIndexedDBModule {
    static forRoot(...dbConfigs: DBConfig[]): ModuleWithProviders<NgxIndexedDBModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxIndexedDBModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<NgxIndexedDBModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<NgxIndexedDBModule>;
}

declare class NgxIndexedDBService {
    private dbConfigs;
    private indexedDB;
    private defaultDatabaseName?;
    private selectedDb;
    constructor(dbConfigs: Record<string, DBConfig>, indexedDB: IDBFactory);
    private instanciateConfig;
    private get dbConfig();
    /**
     * The function return the current version of database
     *
     * @Return the current version of database as number
     */
    getDatabaseVersion(): Observable<number | string>;
    /**
     * Selects a database for the current context.
     * @param {string} [databaseName=undefined] Database name to select.
     */
    selectDb(databaseName?: string): void;
    /**
     * Allows to create a new object store ad-hoc
     * @param storeName The name of the store to be created
     * @param migrationFactory The migration factory if exists
     */
    createObjectStore(storeSchema: ObjectStoreMeta, migrationFactory?: () => {
        [key: number]: (db: IDBDatabase, transaction: IDBTransaction) => void;
    }): Promise<void>;
    /**
     * Create dynamic store if not already without incrementing version
     * For Dynamic store
     * @param storeName The name of the store to create
     */
    createDynamicObjectStore(storeSchema: ObjectStoreMeta, migrationFactory?: () => {
        [key: number]: (db: IDBDatabase, transaction: IDBTransaction) => void;
    }): Promise<void>;
    /**
     * Adds new entry in the store and returns its key
     * @param storeName The name of the store to add the item
     * @param value The entry to be added
     * @param key The optional key for the entry
     */
    add<T>(storeName: string, value: T, key?: any): Observable<T & WithID>;
    /**
     * Adds new entries in the store and returns its key
     * @param storeName The name of the store to add the item
     * @param values The entries to be added containing optional key attribute
     */
    bulkAdd<T>(storeName: string, values: Array<T & {
        key?: any;
    }>): Observable<number[]>;
    /**
     * Delete entries in the store and returns current entries in the store
     * @param storeName The name of the store to add the item
     * @param keys The keys to be deleted
     */
    bulkDelete(storeName: string, keys: IDBValidKey[]): Observable<number[]>;
    /**
     * Returns entry by key.
     * @param storeName The name of the store to query
     * @param key The entry key
     */
    getByKey<T>(storeName: string, key: IDBValidKey): Observable<T>;
    /**
     * Retrieve multiple entries in the store
     * @param storeName The name of the store to retrieve the items
     * @param keys The ids entries to be retrieve
     */
    bulkGet<T>(storeName: string, keys: Array<IDBValidKey>): Observable<T[]>;
    /**
     * Returns entry by id.
     * @param storeName The name of the store to query
     * @param id The entry id
     */
    getByID<T>(storeName: string, id: string | number): Observable<T>;
    /**
     * Returns entry by index.
     * @param storeName The name of the store to query
     * @param indexName The index name to filter
     * @param key The entry key.
     */
    getByIndex<T>(storeName: string, indexName: string, key: IDBValidKey): Observable<T>;
    /**
     * Return all elements from one store
     * @param storeName The name of the store to select the items
     */
    getAll<T>(storeName: string): Observable<T[]>;
    /**
     * Adds or updates a record in store with the given value and key. Return all items present in the store
     * @param storeName The name of the store to update
     * @param value The new value for the entry
     */
    update<T>(storeName: string, value: T): Observable<T>;
    /**
     * Adds or updates a record in store with the given value and key. Return all items present in the store
     * @param storeName The name of the store to update
     * @param items The values to update in the DB
     *
     * @Return The return value is an Observable with the primary key of the object that was last in given array
     *
     * @error If the call to bulkPut fails the transaction will be aborted and previously inserted entities will be deleted
     */
    bulkPut<T>(storeName: string, items: T[]): Observable<IDBValidKey>;
    /**
     * Returns all items from the store after delete.
     * @param storeName The name of the store to have the entry deleted
     * @param query The key or key range criteria to apply
     */
    delete<T>(storeName: string, query: IDBValidKey | IDBKeyRange): Observable<T[]>;
    /**
     * Returns after a successful delete.
     * @param storeName The name of the store to have the entry deleted
     * @param query The key or key range criteria to apply
     */
    deleteByKey(storeName: string, query: IDBValidKey | IDBKeyRange): Observable<void>;
    /**
     * Delete all items by an index.
     * @param storeName The name of the store to query
     * @param indexName The index name to filter
     * @param query The key or key range criteria to apply
     * @param direction A string telling the cursor which direction to travel.
     */
    deleteAllByIndex<T>(storeName: string, indexName: string, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): Observable<void>;
    /**
     * Clear the data in the objectStore.
     * @param storeName The name of the store to have the entries deleted
     */
    clear(storeName: string): Observable<void>;
    /**
     * Delete database.
     */
    deleteDatabase(): Observable<void>;
    /**
     * Returns the open cursor
     * If no matching data are present, the observable is completed immediately.
     * @param options The options to open the cursor
     * @param options.storeName The name of the store to have the entries deleted
     * @param options.query The key or key range criteria to apply
     * @param options.direction A string telling the cursor which direction to travel
     * @param options.mode The transaction mode.
     */
    openCursor<V = any, P extends IDBValidKey = IDBValidKey, K extends IDBValidKey = IDBValidKey>(options: {
        storeName: string;
        query?: IDBValidKey | IDBKeyRange | null;
        direction?: IDBCursorDirection;
        mode: DBMode;
    }): Observable<NgxIDBCursorWithValue<V, P, K>>;
    /**
     * Open a cursor by index filter
     * If no matching data are present, the observable is completed immediately.
     * @param options The options to open the cursor
     * @param options.storeName The name of the store to query
     * @param options.indexName The index name to filter
     * @param options.query The key or key range criteria to apply
     * @param options.direction A string telling the cursor which direction to travel
     * @param options.mode The transaction mode.
     */
    openCursorByIndex<V, P extends IDBValidKey = IDBValidKey, K extends IDBValidKey = IDBValidKey>(options: {
        storeName: string;
        indexName: string;
        query?: IDBValidKey | IDBKeyRange | null;
        direction?: IDBCursorDirection;
        mode?: DBMode;
    }): Observable<NgxIDBCursorWithValue<V, P, K>>;
    /**
     * Returns all items by an index.
     * @param storeName The name of the store to query
     * @param indexName The index name to filter
     * @param query The key or key range criteria to apply
     * @param direction A string telling the cursor which direction to travel.
     */
    getAllByIndex<T>(storeName: string, indexName: string, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): Observable<T[]>;
    /**
     * Returns all primary keys by an index.
     * @param storeName The name of the store to query
     * @param query The key or key range criteria to apply
     * @param direction A string telling the cursor which direction to travel.
     */
    getAllKeysByIndex<P extends IDBValidKey = IDBValidKey, K extends IDBValidKey = IDBValidKey>(storeName: string, indexName: string, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): Observable<IndexKey<P, K>[]>;
    /**
     * Returns the number of rows in a store.
     * @param storeName The name of the store to query
     * @param query The key or key range criteria to apply.
     */
    count(storeName: string, query?: IDBValidKey | IDBKeyRange): Observable<number>;
    /**
     * Returns the number of records within a key range.
     * @param storeName The name of the store to query
     * @param indexName The index name to filter
     * @param query The key or key range criteria to apply.
     */
    countByIndex(storeName: string, indexName: string, query?: IDBValidKey | IDBKeyRange): Observable<number>;
    /**
     * Delete the store by name.
     * @param storeName The name of the store to query
     */
    deleteObjectStore(storeName: string): Observable<void>;
    /**
     * Get all object store names.
     */
    getAllObjectStoreNames(): Observable<string[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxIndexedDBService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxIndexedDBService>;
}

declare const provideIndexedDb: (...dbConfigs: DBConfig[]) => i0.EnvironmentProviders;

export { CONFIG_TOKEN, DBMode, INDEXED_DB, NgxIndexedDBModule, NgxIndexedDBService, SERVER_INDEXED_DB, provideIndexedDb };
export type { DBConfig, IndexDetails, IndexKey, NgxIDBCursor, NgxIDBCursorWithValue, ObjectStoreMeta, ObjectStoreSchema, RequestEvent, RequestEventTarget, WithID };
