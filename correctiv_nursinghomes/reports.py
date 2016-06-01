import os
import re

from elasticsearch_dsl import Index, DocType, String, Q
from elasticsearch_dsl.connections import connections

# Define a default Elasticsearch client
connections.create_connection(hosts=['localhost'])

nursinghome_index = Index('nursinghomes')

STATE_RE = re.compile('/berichte/([\w-]+)/')


@nursinghome_index.doc_type
class Report(DocType):
    filename = String(index='not_analyzed')
    state = String(index='not_analyzed')
    body = String(analyzer='snowball')


def index_pdfs(filenames):
    print('Clearing index...')
    nursinghome_index.delete(ignore=404)
    print('Creating index...')
    Report.init()

    for filename in filenames:
        state = STATE_RE.search(filename).group(1)
        print('Indexing %s' % filename)
        basename, file_extension = os.path.splitext(filename)
        with open(basename + '.txt') as f:
            report = Report(filename=filename, state=state,
                            body=f.read().decode('utf-8'))
            report.save()


def search_reports(state, must_terms, should_terms):
    s = Report.search()
    q = Q('bool',
        must=[Q('match', body=term) for term in must_terms],
        should=[Q('match', body=term) for term in should_terms],
        minimum_should_match=1
    )
    s = s.filter('terms', state=[state]).query(q)
    response = s.execute()
    return response.to_dict()['hits']['hits']
