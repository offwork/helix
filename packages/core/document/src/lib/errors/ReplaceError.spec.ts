import { ReplaceError } from './ReplaceError';
describe('ReplaceError', () => {
  it('given valid message, creates an instance of ReplaceError', () => {
    const error = new ReplaceError('This is a replace error');
    expect(error).toBeInstanceOf(ReplaceError);
  });
});
