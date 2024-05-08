"""empty message

Revision ID: fd8322d336be
Revises: 1ca0d9f49f17
Create Date: 2024-05-08 12:07:34.733616

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fd8322d336be'
down_revision = '1ca0d9f49f17'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('movies',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('image_url', sa.String(), nullable=True),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('rating', sa.SmallInteger(), nullable=True),
    sa.Column('status', sa.Enum('TO_WATCH', 'WATCHING', 'COMPLETED', 'ABANDONED', 'ON_HOLD', name='statusenum'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('movies')
    # ### end Alembic commands ###