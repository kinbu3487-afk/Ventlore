/**
 * Ventlore Worker Daemon Entrypoint
 * Xử lý outbox, indexer quét logs và expiry
 */

export async function startWorker() {
  console.log('Ventlore Worker daemon khởi động...');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startWorker();
}
