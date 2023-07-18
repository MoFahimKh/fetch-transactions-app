import axios from 'axios';

class TendermintRPCClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async getHeight(): Promise<number> {
    const response = await this.sendRPCRequest('status');
    return response.result.sync_info.latest_block_height;
  }

  public async getBlock(height: number): Promise<any> {
    const response = await this.sendRPCRequest('block', { height });
    return response.result;
  }

  private async sendRPCRequest(method: string, params: any = {}): Promise<any> {
    const payload = {
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: 1,
    };

    try {
      const response = await axios.post(this.baseUrl, payload);
      if (response.data.error) {
        throw new Error(response.data.error.message);
      }
      return response.data;
    } catch (error) {
      throw new Error(`RPC request failed: ${error}`);
    }
  }
}

// Usage example
const rpcClient = new TendermintRPCClient('http://localhost:26657');
rpcClient.getHeight()
  .then((height) => {
    console.log(`Latest block height: ${height}`);
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
  });
